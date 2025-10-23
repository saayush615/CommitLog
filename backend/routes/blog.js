import express from 'express';
import { requireAuth, requireAuthor } from '../middlewares/auth.js'
import { handleCreateBlog, handleReadBlog, handleReadBlogById, handleUpdateBlog, handleDeleteBlog, handleToggleLike, handleAddComment, handleDeleteComment } from '../controllers/blog.js';
import { upload } from '../services/upload.js';

const router = express.Router();

// Public routes (no auth needed)
router.get('/read', handleReadBlog);
router.get('/read/:id', handleReadBlogById);
// router.get('/:id/stats', handleGetBlogStats);

// Protected routes (auth required)
router.post('/create', requireAuth, upload.single('coverImage'), handleCreateBlog);
// router.get('read-with-interaction/:id', requireAuth, handleReadBlogWithInteractions);

// Interaction route (auth required)
router.post('/:id/like', requireAuth, handleToggleLike);
router.post('/:id/comment', requireAuth, handleAddComment);
router.delete('/:id/comment/:commentId', requireAuth, handleDeleteComment);

// Author-only routes (auth + ownership required)
router.put('/update/:id', requireAuth, requireAuthor, upload.single('coverImage'), handleUpdateBlog);
router.delete('/delete/:id', requireAuth, requireAuthor, handleDeleteBlog);

export default router;