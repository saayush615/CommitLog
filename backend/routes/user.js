import express from 'express';
import { handleSignup, handleLogin } from '../controllers/user.js';

const router = express.Router();

router.post('/', handleSignup);
router.post('/login', handleLogin);

router.get('/logout', (req, res) => {
    res.clearCookie('uid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    return res.status(200).json({
        success: true,
        message: 'Logout succesfully'
    });
});

export default router;