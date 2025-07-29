const express = require('express');
const Blog = require('../models/blog');
const router = express.Router();

router.get('/', async (req, res) => {
    const blogs = await Blog.find().populate('CreatedBy', 'Name'); // Only populate the Name field
    res.render('home', { user: req.user, blogs });
});
router.get('/signup', (req, res) => {
    res.render('signup');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/create', (req, res) => {
    res.render('create', { user: req.user });
});
router.get('/update/:id', async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id).populate('CreatedBy', 'Name'); // Only populate the Name field

    res.render('update', { user: req.user, blog });
});
router.get('/myBlogs', async (req,res) => { 
    const blogs = await Blog.find({CreatedBy: req.user.id}).populate('CreatedBy', 'Name');
    res.render('myBlogs', { user: req.user, blogs });
 })
module.exports = router;