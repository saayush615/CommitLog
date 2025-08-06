import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const secret = process.env.secret;

function generateToken(user) {
    return jwt.sign({ id: user._id, email: user.email}, secret);
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