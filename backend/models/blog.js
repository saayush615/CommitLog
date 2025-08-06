import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    tumbnail: {
        type: String, // Store the file path or URL of the uploaded image
        required: false, // Optional field        
    }
},{timestamps: true});

export default mongoose.model('blog', blogSchema);