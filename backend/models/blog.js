const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    Tumbnail: {
        type: String, // Store the file path or URL of the uploaded image
        required: false, // Optional field        
    }
},{timestamps: true});

module.exports = mongoose.model('blog', blogSchema);