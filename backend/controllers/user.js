import USER from '../models/user.js';
import { hashPassword, comparePassword } from '../services/hash.js';
import { generateToken } from '../services/auth.js';
import AppError from '../utils/AppError.js';
import { createValidationError, createNotFoundError, createDuplicateError, createUnauthorizedError } from '../utils/errorFactory.js';

async function handleSignup(req, res, next){
    const { firstname, lastname , username, email, password} = req.body;

    // 1. synchronous validations

    // Validate required fields
    if(!firstname || !lastname || !username || !email || !password){
        return next(createValidationError('All fields are required!'));
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return next(createValidationError('Please provide a valid email address'));
    }

    // Password minimun 6 character.
    if(password.length < 6) {
        return next(createValidationError('Password must be at least 6 characters long'));
    }

    try{
        // Check if user already exists (2. asynchronous validations)
        const existingUser = await USER.findOne({ $or: [{email},{username}]});
        if(existingUser){
            return next(createDuplicateError('User with this email or username'));
        };
        const hashedPassword = await hashPassword(password);
        await USER.create({ 
            firstname, 
            lastname , 
            username, 
            email, 
            password: hashedPassword 
        });

        return res.status(201).json({
            success: true,
            message: 'Signedup succesfully. Procced to login'
        });

    } catch(err){
        next(err);
    }
}

async function handleLogin(req,res, next){
    const { usernameOrEmail, password } = req.body; 

    if (!usernameOrEmail || !password) {
        return next(createValidationError('Username/email and password are required'));
    };

    try {
        // Correct way to search by username OR email
        const user = await USER.findOne({
            $or: [
                {email: usernameOrEmail},
                {username: usernameOrEmail}
            ]
        });
        if(!user){
            return next(createUnauthorizedError('Invalid credentials'));
        }
        const isMatch = await comparePassword(password, user.password);
        if(!isMatch){
            return next(createUnauthorizedError('Invalid credentials'));
        }
        const token = generateToken(user);

        res.cookie("uid", token, {
            httpOnly: true,        // Prevent XSS attacks
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',    // CSRF protection
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        return res.status(200).json({
            success: true,
            message: 'Login succesfully',
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email  
            }
        })
    } catch (err) {
        next(err);
    }
}

export { handleSignup, handleLogin };