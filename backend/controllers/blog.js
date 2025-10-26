import Blog from '../models/blog.js';
import fs from 'fs';
import { createValidationError, createNotFoundError, createForbiddenError } from '../utils/errorFactory.js';
import { verifyToken } from '../services/auth.js';

async function handleCreateBlog(req,res, next) {
    const { title, content } = req.body;
    const author = req.user.id;

    if (!title || !content) {
        return next(createValidationError('Title and content are required!'));
    }

    try{
        const blog = await Blog.create({ // Returns a Document Instance -> Every data will be available like blog._id, blog.title 
             title,                      // but can't be populated, It is not query obj(doesnot have query method).   
             content, 
             author,
             coverImage: req.file ? req.file.path : null // Save the file path
            }); 

        // Populate author info and return
        const populatedBlog = await Blog.findById(blog._id).populate('author', 'username firstname lastname');

        return res.status(201).json({
            success: true,
            message: 'Post created successfully',
            blog: populatedBlog
        });
    } catch (err){
        // Clean up uploaded file if database operation fails
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting file:', unlinkErr);
            });
        }

        // ✅ Use next(err) for database errors - let global handler decide
        next(err); // Pass error to global handler
    }
}

async function handleReadBlog(req,res, next)  {
    try{
        const blogs = await Blog.find().populate('author', 'username'); // Only populate the username field
        return res.status(200).json({
            success: true,
            message: 'Blogs fetched successfully', 
            blogs
        });

    } catch (err){
        // ✅ Use next(err) for database errors
        next(err); // pass error to gobal handler
    }
}

async function handleReadBlogById(req,res, next)  {
    const id = req.params.id;
    if(!id){ 
        return next(createValidationError('Blog id is required'));
    }

    try{
        const blog = await Blog.findById(id).populate('author', 'firstname lastname username');
        if(!blog){
            return next(createNotFoundError('Blog'));
        }

        // Check if the authenticated user has liked this blog
        let isLiked = false;
        const token = req.cookies?.uid;

        if (token) {
            const user = verifyToken(token);
            if (user && user.id) {
                isLiked = blog.likes.some(like => like.user.toString() === user.id);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Blog fetched successfully', 
            blog: {
                ...blog,
                isLiked
            }
        });

    } catch (err){
        // ✅ Use next(err) for unexpected database errors (invalid ObjectId format, etc.)
        next(err);
    }
}

// Add this new function after handleReadBlogById
async function handleReadBlogWithInteractions(req, res, next) {
    const id = req.params.id;
    
    if (!id) {
        return next(createValidationError('Blog id is required'));
    }

    try {
        const blog = await Blog.findById(id)
            .populate('author', 'firstname lastname username')
            .populate('comments.user', 'firstname lastname username');
        
        if (!blog) {
            return next(createNotFoundError('Blog'));
        }

        // Check if current user has liked this blog
        let isLiked = false;
        if (req.user) {
            isLiked = blog.likes.some(like => like.user.toString() === req.user.id);
        }

        // Return blog with interaction data
        return res.status(200).json({
            success: true,
            message: 'Blog fetched successfully',
            blog: {
                _doc: blog.toObject(), // Convert mongoose document to plain object
                isLiked
            }
        });

    } catch (err) {
        next(err);
    }
}


async function handleUpdateBlog(req, res, next) {
    try {
        const id = req.params.id;
        const { title, content } = req.body;

        const blog = req.blog;
        
        const updateData = {};
        if(title) updateData.title = title;
        if(content) updateData.content = content;

        if(req.file){
            updateData.coverImage = req.file.path;

            // Delete old cover image if it exists
            if(blog.coverImage && fs.existsSync(blog.coverImage)){
                fs.unlink(blog.coverImage, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting coverImage:', unlinkErr);
            });
            }
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true } // Returns the NEW document (after the update)
        ).populate('author', 'username firstname lastname');

        return res.status(200).json({
            success: true,
            message: 'Data is successfully updated',
            blog: updatedBlog
        })
        
    } catch (err) {
        if(req.file){
            fs.unlink(req.file.path, (unlinkErr) => { 
                if(unlinkErr) console.error('Error deleting the file:', unlinkErr);
             })
        }

        next(err);
    }
}


async function handleDeleteBlog(req,res,next)  {
    try{
        const id = req.params.id;
        const existingblog = req.blog;

        // Delete cover image file if it exists
        if(existingblog.coverImage && fs.existsSync(existingblog.coverImage)){
            fs.unlink(existingblog.coverImage, (handleErr) => { 
                if(handleErr) console.error('Error in deleting cover-Image:', handleErr);
             })
        }

        const blog = await Blog.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
            blog
        });

    } catch (err){
        next(err);
    }
}

// Like / Unlike a blog
async function handleToggleLike(req, res, next) {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;

        const blog = await Blog.findById(blogId);
        if(!blog) {
            return next(createNotFoundError('Blog'));
        }

        // check if user has already liked this blog
        const existingLikeIndex = blog.likes.findIndex(like => like.user.toString() === userId);

        let message;
        let isLiked;

        if(existingLikeIndex > -1) {
            // User has already liked, so unlike it
            blog.likes.splice(existingLikeIndex, 1);
            blog.likesCount = Math.max(0, blog.likesCount - 1);
            message = 'Blog unliked successfully';
            isLiked = false;
        } else {
            // User hasn't liked, so like it
            blog.likes.push({ user: userId });
            blog.likesCount += 1;
            message = 'Blog liked successfully';
            isLiked = true;
        }

        await blog.save();  // Without blog.save(), your changes exist only in memory and disappear when the function ends! 

        return res.status(200).json({
            success: true,
            message: message,
            data: {
                blogId: blog._id,
                likesCount: blog.likesCount,
                isLiked
            }
        })
    } catch (error) {
        next(error);
    }
}

async function handleAddComment(req,res,next) {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;
        const { content } = req.body;

        if(!content || content.trim() === '') {
            return next(createValidationError('Comment content is required'));
        }

        const blog = await Blog.findById(blogId);
        if(!blog) {
            return next(createNotFoundError('Blog'));
        }

        const newComment = {
            user: userId,
            content: content.trim(),
            createdAt: new Date()
        };

        blog.comments.push(newComment);
        blog.commentsCount += 1;

        await blog.save();

        // populate the newly added comment with user info
        const populateBlog = await Blog.findById(blogId)
            .populate('comments.user', 'username firstname lastname')
            .select('comments');  // Projects only the comments field from the blog document. Excludes all other fields (like title, content, etc.)

        const addComment = populateBlog.comments[populateBlog.comments.length - 1];

        return res.status(201).json({
            success: true,
            message: 'Comment added succesfully',
            data: {
                comment: addComment,
                commentsCount: blog.commentsCount
            }
        });

    
    } catch (error) {
        next(error)
    }
}

// Delete comment
async function handleDeleteComment(req, res, next) {
    try{
        const blogId = req.params.id;
        const commentId = req.params.commentId;
        const userId = req.user.id;

        const blog = await Blog.findById(blogId);
        if(!blog){
            return next(createNotFoundError('Blog'));
        }

        // Find the comment
        const commentIndex = blog.comments.findIndex(
            comment => comment._id.toString() === commentId
        );

        // Find the comment
        if(commentIndex === -1) {
            return next(createNotFoundError('Comment'));
        }

        const comment = blog.comment[commentIndex];

        if(comment.user.toString() !== userId && blog.author.toString() !== userId) {
            return next(createForbiddenError('You can only delete your own comment or comment on your blog'));
        }

        // Remove comment
        blog.comments.splice(commentIndex, 1);
        blog.commentsCount = Math.max(0, blog.commentsCount - 1);

        await blog.save();

        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            data: {
                commentsCount: blog.commentsCount
            }
        });
    } catch(err) {
        next(err);
    }
}

// Stats for blog
async function handleGetBlogStats(req,res,next) {
    try {
        const blogId = req.params.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return next(createNotFoundError('Blog'));
        }

        return res.status(200).json({
            success: true,
            message: 'Blog statistics fetched succesfully',
            stats: {
                blogId: blog._id,
                likesCount: blog.likesCount,
                sharesCount: blog.sharesCount,
                commentsCount: blog.commentsCount
            }
        })
    } catch (error) {
        next(error);
    }
}

export {
    handleCreateBlog,
    handleReadBlog,
    handleReadBlogWithInteractions,
    handleUpdateBlog,
    handleDeleteBlog,
    handleToggleLike,
    handleAddComment,
    handleDeleteComment

};