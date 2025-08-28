import Blog from '../models/blog.js';

async function handleCreateBlog(req,res) {
    try{
        const { title, description } = req.body;
        const createdBy = req.user.id;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                error: 'Title and Description are required'
            })
        }
        const blog = await Blog.create({
             title, 
             description, 
             createdBy, 
             tumbnail: req.file ? req.file.path : null // Save the file path
            }); 
        return res.status(201).json({
            success: true,
            message: 'Post created successfully',
            blog
        });
    } catch (err){
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

async function handleReadBlog(req,res)  {
    try{
        const blogs = await Blog.find().populate('createdBy', 'name'); // Only populate the Name field
        return res.status(200).json({
            success: true,
            message: 'Blogs fetched successfully', 
            blogs
        });

    } catch (err){
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

async function handleReadBlogById(req,res)  {
    try{
        const id = req.params.id;
        if(!id){ 
            return res.status(400).json({
                success: false,
                error: 'Blog id is required'
            });
        }
        const blog = await Blog.findById(id).populate('createdBy', 'name'); // Only populate the Name field
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
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}


async function handleUpdateBlog(req, res) {
    try {
        const id = req.params.id;
        const { title, description } = req.body;
        
        // Prepare update data
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (req.file) updateData.thumbnail = req.file.path;

        // Update blog
        const blog = await Blog.findByIdAndUpdate(
            id, 
            updateData,
            { new: true }
        ).populate('createdBy', 'name');

        if (!blog) {
            return res.status(404).json({
                success: false, 
                error: 'Blog not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blog updated',
            blog
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });;
    }
}


async function handleDeleteBlog(req,res)  {
    try{
        const id = req.params.id;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        await Blog.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
        });

    } catch (err){
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