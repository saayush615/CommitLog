const express = require('express');
const { handleCreateBlog, handleReadBlog, handleReadBlogById, handleUpdateBlog, handleDeleteBlog } = require('../controllers/blog');
const router = express.Router();
const {upload} = require('../services/upload')

router.post('/create',upload.single('Tumbnail'), handleCreateBlog);
router.get('/read', handleReadBlog);
router.get('/read/:id', handleReadBlogById);
router.put('/update/:id', upload.single('Tumbnail'), handleUpdateBlog);
router.delete('/delete/:id', handleDeleteBlog);

module.exports = router;