import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create a upload directory if it doesnot exists
const uploadDir = 'uploads/blog-cover';
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true }); // recusive: handle nested path
}

// Configure storage -> where and how to save the uploaded files on your server's disk.
const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, uploadDir); // In the error-first callback pattern, the very first argument is always reserved for an error object.
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // 1E9 = 1*10^9 = 1billion -> this generate random number form 0 to 1 billion
        cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
    }
})

// file filter - only allow images
const fileFilter = (req,file,cb) => { 
    if(file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else{
        cb(new Error('Only image files are allowed!'), false);
    }
 };

//  configure multer -> This is where you bring all the pieces together to create the final multer instance that you'll use in your application routes.
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Limit number of files
    },
    fileFilter: fileFilter
});

export { upload };