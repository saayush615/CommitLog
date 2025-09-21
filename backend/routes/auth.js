import express from 'express';
import passport from '../config/passport.js';
import { generateToken } from '../services/auth.js';

const router = express.Router();

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
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?auth=success`);
        } catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=callback_failed`);
        }
});

// OAuth logout route
router.get('/logout', (req, res) => {
    res.clearCookie('uid');
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`);
});

export default router;