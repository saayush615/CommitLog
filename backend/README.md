# Backend Notes

## Note 1:
In ES modules (.mjs or "type": "module" in package.json), __dirname and __filename are not available by default.
To replicate their behavior, use:
```js
import { fileURLToPath } from 'url';
import Path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
```
**Purpose:** 
> This ensures compatibility with ES module syntax and allows you to reference the current file and directory paths as in CommonJS.

---

## Note 2: CORS (Cross origin resource sharing) configuration
This project uses [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) middleware to allow requests from the frontend application.  
A security feature implemented by web browsers that allows a server to indicate which origins (domains, schemes, or ports) are permitted to access its resources. 
```js
import cors from 'cors';
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Your frontend URL
    credentials: true    // Allow cookies to be sent/received
}))
```
**Purpose:**  
> Ensures secure cross-origin communication between the frontend and backend, especially when handling user authentication or sessions.which is  normally prohibited by the Same-Origin Policy. 

---

## Note 3: Cookie Parsing Middleware
This project uses the `cookie-parser` middleware in Express to automatically parse incoming HTTP request cookies. It reads the raw `Cookie` header from requests, converts it into a JavaScript object, and attaches it to `req.cookies`. This simplifies cookie handling throughout the app.

```js
import cookieParser from 'cookie-parser';
app.use(cookieParser());
```

---

## Note 4: Express built-in middleware 

- express.json(): Parses incoming requests with JSON payloads and makes the data available as req.body.
- express.urlencoded({ extended: true }): Parses incoming requests with URL-encoded payloads (typically from HTML forms) and makes the data available as req.body.

**Purpose:**
>These middlewares ensure that request data (from APIs or forms) is automatically converted to JavaScript objects, simplifying data handling in route handlers.

---

## Topic 1: Database Configuration
```js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to DB
async function connectDB(){
    await mongoose.connect(process.env.CommitLogDB); 
    console.log('✅ Connected to DB');
};
connectDB().catch((err) => { 
    next(err); // global error handling
    process.exit(1);
});
```
**Points to remember:**
- **Database connections** are **asynchronous** because they involve network communication, which can take time and may fail.
- **Mongoose is an ODM (Object Data Modeling)** library for MongoDB in Node.js, which helps you define schemas, models, and interact with MongoDB using JavaScript objects.
- **process.exit(1)** immediately stops the Node.js process with exit code 1, which signals that the program ended due to an error (non-zero codes indicate failure).
---

## Topic 2: Mongoose schema & Indexes(Models)
```js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {   
        type: String,  // SchemaTypes(String,Number,Date,Boolean etc)
        required: true, // SchemaType Options(require, validate etc)
        unique: true,
    }
}, {timestamps: true}); // automatically adds two fields to your documents: createdAt, updatedAt

export default mongoose.model('User', userSchema);  // Creates a model named 'User' based on the userSchema, 
// The model is a class with which you construct documents for the 'users' collection in MongoDB.
```

#### ObjectIds:
```js
author: {
    type: mongoose.Schema.Types.ObjectId,   // ObjectId, we can .populate() it.
    ref: 'User',
    required: true,
},
```

#### Index: for faster data retrieval.
```js

// Comments array - stores actual comment data
comments: [{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500 // Prevents spam and keeps comments concise
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically timestamps each comment
    }
}],

// Counter field - stores total number of comments
commentsCount: {
    type: Number,
    default: 0 // Starts at 0, incremented when comments are added
},

// INDEXES for performance optimization
blogSchema.index({ 'comments.user': 1}); // Fast lookup: "Find all comments by specific user"
blogSchema.index({ commentsCount: -1});  // Fast sorting: "Show blogs with most comments first"

```

---

## Topic 3: Global Error Handling
a robust error handling architecture with custom error classes, factory functions, and centralized error processing.

#### Custom Error Class
```js
// utils/AppError.js
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message); // Call parent Error constructor
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational; // Distinguishes operational vs programming errors
        
        // Capture stack trace, excluding this constructor
        Error.captureStackTrace(this, this.constructor);
    }
}
```

#### Error Factory Functions
```js
// utils/errorFactory.js
import AppError from "./AppError.js";

// Factory functions for common error types
export const createValidationError = (message = 'Validation failed') => 
    new AppError(message, 400);

// ...ETC
```

#### Global Error Handler Middleware
_Structure & Flow_

- **4 parameters required: (error, req, res, next)** - Express recognizes this as error middleware
- **Always log errors first** with context (message, stack, url, method, timestamp)
- **Handle errors in order**: Most specific → Most general
- **Must be last** middleware in Express app

_Error Categories to Handle_

1. **Custom Operational Errors**
```js
if(error instanceof AppError) {
    return res.status(error.statusCode).json({
        success: false,
        error: error.message
    });
}
```
2. **File Upload Errors (Multer)**
```js
if(error instanceof multer.MulterError) {
    switch(error.code) {
        case 'LIMIT_FILE_SIZE': // File too large
        case 'LIMIT_UNEXPECTED_FILE': // Wrong field name
        case 'LIMIT_FIELD_COUNT': // Too many files
    }
}
```
3. **Database Errors (MongoDB/Mongoose)**
- CastError: Invalid ObjectId format
- Code 11000: Duplicate key error (unique constraint)
- ValidationError: Schema validation failed

4. **Authentication Errors (JWT)**
- JsonWebTokenError: Invalid token
- TokenExpiredError: Token expired

5. **Custom File Type Errors**
```js
if(error.message === 'Only image files are allowed') {
    // Handle custom validation
}
```
6. **Default Fallback**
```js
// Programming errors - hide details in production
return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong!' 
        : error.message
});
```


#### Implementation in Express App
```js
// index.js
import { globalErrorHandler } from './middlewares/errorHandler.js';

// Routes
app.use('/user', userRoute);
app.use('/blog', blogRoute);
app.use('/auth', authRoute);

// Handle 404 - Route not found
app.use('*', (req, res) => { 
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Global error handler (MUST be last middleware)
app.use(globalErrorHandler);
```

#### Usage in Controllers
```js
// controllers/user.js
import { createValidationError, createDuplicateError } from '../utils/errorFactory.js';

async function handleSignup(req, res, next) {
    const { firstname, lastname, username, email, password } = req.body;

    // Validation
    if (!firstname || !lastname || !username || !email || !password) {
        return next(createValidationError('All fields are required!'));
    }

    try {
        // Check if user exists
        const existingUser = await USER.findOne({ $or: [{email}, {username}] });
        if (existingUser) {
            return next(createDuplicateError('User with this email or username'));
        }
        
        // Create user...
    } catch (err) {
        next(err); // Pass any unexpected errors to global handler
    }
}
```

#### How It Works
1. **Error Creation**: Controllers use factory functions to create standardized errors
```js
return next(createNotFoundError('Blog')); // Creates 404 error
```
2. **Error Propagation**: next(error) passes errors to Express error handling middleware

3. **Centralized Processing**: Global error handler catches all errors and:
    - Logs error details for debugging
    - Determines error type (operational vs programming)
    - Formats appropriate response for client
    - Hides sensitive details in production

4. **Consistent Responses**: All errors return standardized JSON format:
```json
{
  "success": false,
  "error": "User-friendly error message"
}
```
---

## Topic 4: Authentication & Auth middleware

### JWT Token Management
```js
import jwt from 'jsonwebtoken';

function generateToken(user) {}
function verifyToken(token) {}
```
#### Authentication Middleware Chain
```js
// middlewares/auth.js

// Optional authentication check
async function checkAuth(req, res, next) {}

// Required authentication
async function requireAuth(req, res, next) {}

// Author authorization (ownership check)
async function requireAuthor(req, res, next) {}
```
_Middleware Hierarchy_:

- `checkAuth`: Sets req.user if valid token exists (optional)
- `requireAuth`: Ensures user is authenticated (mandatory)
- `requireAuthor`: Ensures user owns the resource (ownership)

#### Usage in Routes:
```js
// Public routes
router.get('/read', handleReadBlog);

// Protected routes (auth required)
router.post('/create', requireAuth, handleCreateBlog);

// Author-only routes (auth + ownership)
router.put('/:id', requireAuth, requireAuthor, handleUpdateBlog);
router.delete('/:id', requireAuth, requireAuthor, handleDeleteBlog);
```
---

## Topic 5: OAuth - Passportjs
OAuth (Open Authorization) is a secure way to let users log in using their existing accounts from other services like Google or GitHub, without sharing their passwords with your app.

#### How OAuth Works (Simple Flow)
- **User clicks "Continue with Google"** → Redirected to Google's login page
- **User logs in to Google** → Google asks "Allow CommitLog to access your profile?"
- **User approves** → Google sends user back to your app with a special code
- **Your app exchanges the code** → Gets user's profile information from Google
- **Your app creates/logs in the user** → Sets authentication cookie


#### Step 1: Passport Configuration

```js
// config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,   // make it in console.cloud.google.com
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    // This function runs when Google sends back user data
}));

export default passport;
```
_What this does_:

- Sets up how Passport should handle Google/GitHub authentication
- Defines what happens when user data comes back from the OAuth provider
- Handles 3 scenarios: existing OAuth user, existing email user, or completely new user

#### Step 2: User Schema for OAuth Support
```js
// models/user.js
const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: function() {
            // Password only required if user didn't sign up via OAuth
            return !this.googleId && !this.githubId;
        }
    },
    googleId: { // Stores unique Google user identifier
        type: String, 
        unique: true,
        sparse: true  // Allow the null value but ensures uniqueness when present
     },
    authProvider: { // Tracks how user registered
        type: String, 
        enum: ['local', 'google', 'github'], 
        default: 'local' 
    }
});
```
_What this does_:

- Stores OAuth IDs (googleId, githubId) to link accounts
- Makes password optional for OAuth users
- Tracks how the user signed up (authProvider)
- Stores profile picture from OAuth provider

#### Step 3: OAuth Routes
```js
// routes/auth.js
import express from 'express';
import passport from '../config/passport.js';
import { generateToken } from '../services/auth.js';

const router = express.Router();

// Step 1: Start Google OAuth flow
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'] // Request access to profile and email
    })
);

// Step 2: Handle Google's response
router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
        session: false // We use JWT instead of sessions
    }),
    async (req, res) => {
        try {
            // Generate JWT token for authenticated user
            const token = generateToken(req.user);

            // Set secure HTTP-only cookie
            res.cookie("uid", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            // Redirect to frontend with success message
            res.redirect(`${process.env.FRONTEND_URL}/?auth=google_success`);
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_failed`);
        }
    }
);

```

_What this does_:

- `/auth/google` → Redirects user to Google's consent screen
- `/auth/google/callback` → Handles Google's response, creates JWT, sets cookie
- `/auth/me` → Checks if user is currently authenticated

#### Step 4: Express App Setup
```js
// index.js
import express from 'express';
import passport from 'passport';
import './config/passport.js'; // Import passport configuration

const app = express();

// Initialize Passport middleware
app.use(passport.initialize());

// Other middleware...
app.use(checkAuth); // Custom middleware to verify JWT tokens

// Routes
app.use('/auth', authRoute);   // passport js Oauth route
```
_What this does_:

- Imports and initializes Passport
- Sets up middleware to check authentication on each request

#### Step 5: Frontend Integration
```js
// Login.jsx - Frontend component
const handleGoogleAuth = () => {
    // Redirect to backend OAuth route
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};

const handleGitHubAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
};

// In JSX
<button onClick={handleGoogleAuth}>
    Continue with Google
</button>
```
```js
// Home.jsx - Handle OAuth success/failure
useEffect(() => {
    const authStatus = searchParams.get('auth');
    if (authStatus === 'google_success' || authStatus === 'github_success') {
        toast.success('Login Successfully!');
        setSearchParams({}); // Clean up URL
    }
}, [searchParams]);
```
_What this does_:

- Provides buttons that redirect to OAuth flow
- Handles success/failure messages when user returns

---

## Topic 6: File Upload with Multer

### Multer Configuration
> Read services/upload.js (to understand configurations).

 #### Usage in Routes
 ```js
 // routes/blog.js
router.post('/create', requireAuth, upload.single('coverImage'), handleCreateBlog);
 ```

 #### Error Handling for File Uploads
File upload errors are handled in the global error handler:
```js
// middlewares/errorHandler.js
if (error instanceof multer.MulterError) {
    switch(error.code) {
        case 'LIMIT_FILE_SIZE':
        case 'LIMIT_UNEXPECTED_FILE':
        default:
    }
}
```
---

---

## Topic 7: Password Security

### Password Hashing with bcrypt
```js
// services/hash.js
import bcrypt from 'bcryptjs';

async function hashPassword(password) {
    const hash = await bcrypt.hash(password, 10); // 10 salt rounds
    return hash;
}

async function comparePassword(password, hash) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}
```

---