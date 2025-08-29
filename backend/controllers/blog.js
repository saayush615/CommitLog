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
        const blog = await Blog.create({
             title, 
             content, 
             author
            //  tumbnail: req.file ? req.file.path : null // Save the file path
            }); 
        return res.status(201).json({
            success: true,
            message: 'Post created successfully',
            blog
        });
    } catch (err){
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
        
        const updateData = {};
        if(title) updateData.title = title;
        if(content) updateData.content = content;

        const blog = await Blog.findByIdAndUpdate(id, updateData);

        return res.status(200).json({
            success: true,
            message: 'Data is successfully updated'
        })
        
    } catch (err) {
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