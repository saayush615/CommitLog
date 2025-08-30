import express from 'express';
import { requireAuth, requireAuthor } from '../middlewares/auth.js'
import { handleCreateBlog, handleReadBlog, handleReadBlogById, handleUpdateBlog, handleDeleteBlog } from '../controllers/blog.js';
import { upload } from '../services/upload.js';

const router = express.Router();

// Public routes (no auth needed)
router.get('/read', handleReadBlog);
router.get('/read/:id', handleReadBlogById);

// Protected routes (auth required)
router.post('/create', requireAuth, upload.single('coverImage'), handleCreateBlog);

// Author-only routes (auth + ownership required)
router.put('/update/:id', requireAuth, requireAuthor, upload.single('coverImage'), handleUpdateBlog);
router.delete('/delete/:id', requireAuth, requireAuthor, handleDeleteBlog);

export default router;