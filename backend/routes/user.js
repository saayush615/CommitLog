import express from 'express';
import { handleSignup, handleLogin } from '../controllers/user.js';

const router = express.Router();

router.post('/', handleSignup);
router.post('/login', handleLogin);

router.get('/logout', (req, res) => {
    res.clearCookie('uid');
    return res.status(400).json({
        success: true,
        message: 'Logout succesfully'
    });
});

export default router;