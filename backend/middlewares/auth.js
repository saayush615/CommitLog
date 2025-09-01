import { verifyToken } from '../services/auth.js';
import Blog from '../models/blog.js'
import { createUnauthorizedError, createForbiddenError, createNotFoundError } from '../utils/errorFactory.js'

async function checkAuth(req, res, next) {
    const userUid = req.cookies?.uid;
    req.user = null;
    if(!userUid){
       return next();
    }
    const user = verifyToken(userUid);
    if(!user) return next();
    req.user = user;
    next();
}

//Authentication is required
async function requireAuth(req,res,next) {
    if (!req.user) {
        return next(createUnauthorizedError())
    }
    next();
}

// middleware for author authorization
async function requireAuthor(req,res,next) {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if(!blog){
            return next(createNotFoundError('Blog'))
        }

        if(blog.author.toString() !== req.user.id){
            return next(createForbiddenError('You can only modify your own posts.'))
        }

        // Attach the blog 
        req.blog = blog;
        next();
    } catch (error) {
        next(error);
    }
}

export { checkAuth, requireAuth, requireAuthor };