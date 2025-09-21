import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname: {  // SchemaType Options
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId && !this.githubId;
        }
    },
    googleId: {  // Stores unique Google user identifier
        type: String,
        unique: true,
        sparse: true // Allow the null value but ensures uniqueness when present
    },
    githubId: {  // Stores unique Github user identifier
        type: String,
        unique: true,
        sparse: true
    },
    authProvider: { // Tracks how user registered
        type: String,
        enum: ['local','google', 'github'],
        default: 'local'
    },
    profilePicture: {
        type: String,
        default: null
    }
}, {timestamps: true});

export default mongoose.model('User', userSchema);