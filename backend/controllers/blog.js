import Blog from '../models/blog.js';
import fs from 'fs';
import { createValidationError, createNotFoundError } from '../utils/errorFactory.js';

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

        return res.status(200).json({
            success: true,
            message: 'Blog fetched successfully', 
            blog
        });

    } catch (err){
        // ✅ Use next(err) for unexpected database errors (invalid ObjectId format, etc.)
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

export {
    handleCreateBlog,
    handleReadBlog,
    handleReadBlogById,
    handleUpdateBlog,
    handleDeleteBlog
};