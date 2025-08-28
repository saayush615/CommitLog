import USER from '../models/user.js';
import { hashPassword, comparePassword } from '../services/hash.js';
import { generateToken } from '../services/auth.js';

async function handleSignup(req, res){
    const { firstname, lastname , username, email, password} = req.body;

    // 1. synchronous validations

    // Validate required fields
    if(!firstname || !lastname || !username || !email || !password){
        return res.status(400).json({
            success: false,
            error: 'All fields are required'
        })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success: false,
            error: 'Please provide a valid email address'
        })
    }

    // Password minimun 6 character.
    if(password.length < 6) {
        return res.status(400).json({
            success: false,
            error: 'Password must be at least 6 characters long'
        });
    }

    try{
        // Check if user already exists (2. asynchronous validations)
        const existingUser = await USER.findOne({ $or: [{email},{username}]});
        if(existingUser){
            return res.status(400).json({
                success: false,
                error: 'User with this email or username already exists'
            })
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
        console.error('Signup error:', err); // for debugging

        return res.status(500).json({
            success: false,
            error: 'Internal Server error' // we donot directly send the raw error to client
        });
    }
}

async function handleLogin(req,res){
    const { usernameOrEmail, password } = req.body; 

    if (!usernameOrEmail || !password) {
        return res.status(400).json({
            success: false,
            error: 'Username/email and password are required'
        })
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
            return res.status(401).json({ // 401 = authentication failure
                success: false,
                error: 'Invalid credentials'
            });
        }
        const isMatch = await comparePassword(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
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
        // for debugging
        console.error('Login error:',err);

        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

export { handleSignup, handleLogin };