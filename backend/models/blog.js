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
    },
    // likes
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now 
        }
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    // shares
    shares: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        sharedAt: {
            type: Date,
            default: Date.now
        }
    }],
    sharesCount: {
        type: Number,
        default: 0
    },
    // Comment
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500 // Limit comment length
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    commentsCount: {
        type: Number,
        default: 0
    }
},{timestamps: true});

// Add indexes for better performance
blogSchema.index({ 'likes.user': 1});
blogSchema.index({ 'shares.user': 1});
blogSchema.index({ 'comments.user': 1});
blogSchema.index({ likesCount: -1})
blogSchema.index({ sharesCount: -1})
blogSchema.index({ commentsCount: -1})


export default mongoose.model('blog', blogSchema);