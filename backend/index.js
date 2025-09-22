import express from 'express';
import Path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Import passport configuration
import './config/passport.js';  // 1. Execute the file without importing anything
                                // 2. Configures Passport globally
import passport from 'passport';

import { checkAuth } from './middlewares/auth.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';

import userRoute from './routes/user.js';
import blogRoute from './routes/blog.js';
import authRoute from './routes/auth.js';

const app = express();

dotenv.config();

//  __dirname doesn't exist in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Your frontend URL
    credentials: true    // Allow cookies to be sent/received
}))


// Initialize Passport middleware
app.use(passport.initialize());  // Sets up Passport in your Express app

// 2 buildin and 1 third party middleware
app.use(express.json());  // they are body-parsers. convert incomming json data in js object.  and attaches it to the request object as "req.body"
app.use(express.urlencoded({ extended: true })); // convert "form" data in js object format. keep it clean. make available inside "req.body" object
app.use(cookieParser()); // reads this raw Cookie header string
                        // parses it into a regular JavaScript object, attaches this object to the request object as "req.cookies"

app.use(checkAuth); // Middleware to check authentication

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(Path.join(__dirname, 'uploads')));

// Connect to DB
async function connectDB(){
    await mongoose.connect(process.env.CommitLogDB);
    console.log('✅ Connected to DB');
};
connectDB().catch((err) => { 
    next(err);
    process.exit(1);
});

app.get('/',(req,res) => { 
    return res.status(200).json({
        success: true,
        message: 'Welcome to blog backend'
    })
 })

app.use('/user', userRoute);
app.use('/blog', blogRoute);
app.use('/auth', authRoute);

// Add route not found error before Global error
app.use('*', (req,res) => { 
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
 });

// Global error handler (must be last middleware)
app.use(globalErrorHandler)

const port = process.env.PORT || 3000;
app.listen(port,() => { 
    console.log(`Server is running on port ${port}`);
 })
