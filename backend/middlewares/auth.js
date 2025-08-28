import { verifyToken } from '../services/auth.js';
import Blog from '../models/blog.js'

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
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }
    next();
}

// middleware for author authorization
async function requireAuthor(req,res,next) {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            })
        }

        if(blog.author.toString() !== req.user.id){
            return res.status(403).json({
                success: false,
                error: 'You can only modify your own posts'
            })
        }

        // Attach the blog 
        req.blog = blog;
        next();
    } catch (error) {
        console.error('Author Authorization error:', err); // debugging
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

export { checkAuth, requireAuth, requireAuthor };