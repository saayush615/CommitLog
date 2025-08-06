import express from 'express';
import { handleCreateBlog, handleReadBlog, handleReadBlogById, handleUpdateBlog, handleDeleteBlog } from '../controllers/blog.js';
import { upload } from '../services/upload.js';

const router = express.Router();

router.post('/create',upload.single('Tumbnail'), handleCreateBlog);
router.get('/read', handleReadBlog);
router.get('/read/:id', handleReadBlogById);
router.put('/update/:id', upload.single('Tumbnail'), handleUpdateBlog);
router.delete('/delete/:id', handleDeleteBlog);

export default router;