import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const secret = process.env.JWT_SECRET;

function generateToken(user) {
    return jwt.sign(
        { 
        id: user._id, 
        username: user.username, 
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        createdAt: user.createdAt
        }, 
        secret,
        { expiresIn: '24h' }
    );
}

function verifyToken(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (err){
        return null;
    }
}

export { generateToken, verifyToken };