import express from 'express';
import passport from '../config/passport.js';
import { generateToken } from '../services/auth.js';
import { createValidationError, createDuplicateError, createUnauthorizedError } from '../utils/errorFactory.js';


const router = express.Router();

// ==================== GOOGLE OAUTH ====================

// Start Google oAuth flow
// Redirect user to Google's consent screen
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile','email'] //Request access to profile and email
    })
);

// Google OAuth callback route -> Google redirects here after user grants/denies permission
router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`,
        session: false // we'll use JWT instead of sessions
    }),
    async (req, res) => {
        // Successful authentication, redirect home.
        try {
            // Generate JWT token for authenticated user
            const token = generateToken(req.user);

            // Set secure HTTP-only cookie
            res.cookie("uid", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            // Redirect to frontend with success
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?auth=google_success`);
        } catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=callback_failed`);
        }
});

// ==================== GITHUB OAUTH ====================

// Start GitHub OAuth flow
router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }) // Request access to user profile and email

);

// GitHub OAuth callback route
router.get('/github/callback', 
    passport.authenticate('github', { 
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=github_oauth_failed`,
        session: false 
    }),
  async (req, res) => {
    try {
        const token = generateToken(req.user);

        res.cookie("uid", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?auth=github_success`);
    } catch(error) {
        console.error('GitHub OAuth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=github_callback_failed`);
    }
  });



router.get('/me', async (req,res) => {
    try {
        // req.user is set by checkAuth middleware if user is authenticated
        if (req.user) {
            return res.status(200).json({
                success: true,
                user: {
                    id: req.user.id,
                    username: req.user.username,
                    email: req.user.email,
                    firstname: req.user.firstname,
                    lastname: req.user.lastname,
                    createdAt: req.user.createdAt
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
})

export default router;