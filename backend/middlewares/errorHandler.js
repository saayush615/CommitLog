import multer from "multer";

function globalErrorHandler(error, req, res, next) {
    // Handle multer errors
    if(error instanceof multer.MulterError) {
        if(error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File is too large. Maximum file size is 5MB.'
            });
        }
    }

    // Handle custom file type errors
    if(error.message === 'Only image file are allowed') {
        return res.status(400).json({
            success: false,
            error: 'Only image files are allowed!'
        });
    }
}

export {globalErrorHandler};