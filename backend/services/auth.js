const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const secret = process.env.secret;

function generateToken(user) {
    return jwt.sign({ id: user._id, Email: user.Email}, secret);
}

function verifyToken(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (err){
        return null;
    }
}

module.exports = { generateToken, verifyToken };