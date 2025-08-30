import Blog from '../models/blog.js';

async function handleCreateBlog(req,res) {
    const { title, content } = req.body;
    const author = req.user.id;

    if (!title || !content) {
        return res.status(400).json({
            success: false,
            error: 'Title and Content are required'
        })
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
            populatedBlog
        });
    } catch (err){
        // Clean up uploaded file if database operation fails
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting file:', unlinkErr);
            });
        }

        console.error('Create blog error:', err); // debugging
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

async function handleReadBlog(req,res)  {
    try{
        const blogs = await Blog.find().populate('author', 'username'); // Only populate the username field
        return res.status(200).json({
            success: true,
            message: 'Blogs fetched successfully', 
            blogs
        });

    } catch (err){
        console.error('handle blog error:', err); // debugging
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

async function handleReadBlogById(req,res)  {
    const id = req.params.id;
    if(!id){ 
        return res.status(400).json({
            success: false,
            error: 'Blog id is required'
        });
    }

    try{
        const blog = await Blog.findById(id).populate('author', 'firstname lastname username');
        if(!blog){
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blog fetched successfully', 
            blog
        });

    } catch (err){
        console.error('handle by id blog error:', err); // debugging
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}


async function handleUpdateBlog(req, res) {
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

        const newBlog = await Blog.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true } // Returns the NEW document (after the update)
        ).populate('author', 'username firstname lastname');

        return res.status(200).json({
            success: true,
            message: 'Data is successfully updated',
            newBlog
        })
        
    } catch (err) {
        if(req.file){
            fs.unlink(req.file.path, (unlinkErr) => { 
                if(unlinkErr) console.error('Error deleting the file:', unlinkErr);
             })
        }

        console.error('Error in handleUpdateBlog:', err); // debugging
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });;
    }
}


async function handleDeleteBlog(req,res)  {
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
        console.error('Error in handleDeleteBlog:', err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

export {
    handleCreateBlog,
    handleReadBlog,
    handleReadBlogById,
    handleUpdateBlog,
    handleDeleteBlog
};