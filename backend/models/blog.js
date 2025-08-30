import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    coverImage: {
        type: String,
        default: null // optional field for cover image path
    }
},{timestamps: true});

export default mongoose.model('blog', blogSchema);