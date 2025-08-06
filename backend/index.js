import express from 'express';
import Path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';

import { checkAuth } from './middlewares/auth.js';

import userRoute from './routes/user.js';
import blogRoute from './routes/blog.js';

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkAuth); // Middleware to check authentication
app.use(methodOverride('_method')); // Use method-override to support DELETE and PUT methods

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(Path.join(__dirname, 'uploads')));

// Connect to DB
async function connectDB(){
    await mongoose.connect(process.env.CommitLogDB);
    console.log('✅ Connected to DB');
};
connectDB().catch((err) => { 
    console.log('❌ Error connecting to DB', err);
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

const port = process.env.PORT || 3000;
app.listen(port,() => { 
    console.log(`Server is running on port ${port}`);
 })
