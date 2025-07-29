const Blog = require('../models/blog');

async function handleCreateBlog(req,res) {
    try{
        const { Title, Description } = req.body;
        const CreatedBy = req.user.id;
        const blog = await Blog.create({ Title, Description, CreatedBy, Tumbnail: req.file ? req.file.path : null }); // Save the file path
        return res.redirect('/');
    } catch (err){
        return res.render('home', { error: err.message, user: req.user });
    }
}

async function handleReadBlog(req,res)  {
    try{
        const blogs = await Blog.find().populate('CreatedBy', 'Name'); // Only populate the Name field
        return res.status(200).json({message: 'Blogs fetched successfully', blogs});

    } catch (err){
        return res.status(500).json({error: err.message});
    }
}

async function handleReadBlogById(req,res)  {
    try{
        const id = req.params.id;
        if(!id) return res.status(400).json({error: 'Blog id is required'});
        const blog = await Blog.findById(id).populate('CreatedBy', 'Name'); // Only populate the Name field
        if(!blog) return res.status(404).json({error: 'Blog not found'});
        return res.status(200).json({message: 'Blog fetched successfully', blog});

    } catch (err){
        return res.status(500).json({error: err.message});
    }
}


async function handleUpdateBlog(req, res) {
    try {
        const id = req.params.id;
        const { Title, Description } = req.body;

        
        // Prepare update data
        const updateData = { Title, Description };
        if (req.file) {
            updateData.Tumbnail = req.file.path;
        }

        // Update blog
        const blog = await Blog.findByIdAndUpdate(
            id, 
            updateData,
            { new: true }
        ).populate('CreatedBy', 'Name');

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        return res.redirect('/myBlogs');
    } catch (err) {
        console.error('Update error:', err);
        return res.status(500).json({ error: err.message });
    }
}


async function handleDeleteBlog(req,res)  {
    try{
        const id = req.params.id;

        const blog = await Blog.findByIdAndDelete(id).populate('CreatedBy', 'Name');
        return res.redirect('/myBlogs');

    } catch (err){
        return res.status(500).json({error: err.message});
    }
}

module.exports = {
    handleCreateBlog,
    handleReadBlog,
    handleReadBlogById,
    handleUpdateBlog,
    handleDeleteBlog
};