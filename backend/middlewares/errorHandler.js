import multer from "multer";
import AppError from "../utils/AppError.js";

function globalErrorHandler(error, req, res, next) {
    // Log all errors for debugging
    console.error('Error:',{
        message: error.message, // Human-readable error description.
        stack: error.stack, // Stack trace at the point the error was thrown. Shows where the error occurred.
        url: req.url,  // The URL of the incoming request
        method: req.method, // The HTTP method of the request (GET, POST, etc.)
        timestamp: new Date().toISOString() // // .toISOString() returns date/time in standardized string format.
    })
    
    // Handle the operational errors -> occur during normal operation (e.g., invalid user input, failed database connection).
    // (our custom AppError)
    if(error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            error: error.message
        })
    }

    // Handle multer errors
    if(error instanceof multer.MulterError) {
        switch(error.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                    success: false,
                    error: 'File is too large. Maximum file size is 5MB.'
                });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                    success: false,
                    error: 'Unexpected file field. Only "coverImage" is allowed.'
                });
            case 'LIMIT_FILD_COUNT':
                return res.status(400).json({
                    success: false,
                    error: 'Too many files. Only one file is allowed.'
                });
            default:
                return res.status(400).json({
                    success: false,
                    error: 'File upload error: ' + error.message
                });
        }
    }

    // Handle custom file type errors
    if(error.message === 'Only image files are allowed') {
        return res.status(400).json({
            success: false,
            error: 'Only image files are allowed!'
        });
    }

    // Handle MongoDB/Mongoose errors
    if (error.name === 'ValidationError') { // error.name = The type of error
        return res.status(400).json({
            success: false,
            error: 'Validation error: ' + error.message
        });
    }

    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: 'Invalid ID format'
        });
    }

    if(error.code === 11000) { // MongoDB duplicate key error. error.code = Custom error codes (e.g., "E11000" for MongoDB duplicate key)
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
            success: false,
            error: `${field} already exists`
        });
    }

    // Handle JWT errors
    if(error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }

    if(error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: 'Token has expired'
        });
    }

    // default error (unhandled/ programming errors -> Bugs in the code, such as typos, undefined variables, or logic mistakes.)
    return res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Something went Wrong!' : error.message
    });
}

export {globalErrorHandler};