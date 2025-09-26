# CommitLog - MERN Stack Interview Notes

## **Backend Architecture & Implementation**

### **1. Authentication & Authorization**

#### **JWT(Stateless) vs Sessions Comparison(statefull)**
```javascript
// JWT Implementation (Stateless)
import jwt from 'jsonwebtoken';

const token = jwt.sign(
    { id: user._id, username: user.username, email: user.email }, 
    secret,
    { expiresIn: '24h' }
);

// Pros: Scalable, no server storage, works across domains
// Cons: Can't revoke before expiry, larger payload
```

**Use Cases:**
- Microservices architecture
- Cross-domain authentication
- Mobile applications
- Stateless API design

#### **Cookie Security Implementation**
```javascript
res.cookie("uid", token, {
    httpOnly: true,        // Prevent XSS attacks - no JS access
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    sameSite: 'strict',    // CSRF protection
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
```

**Security Benefits:**
- **httpOnly**: Prevents client-side JS from accessing the cookie
- **secure**: Only sent over HTTPS in production
- **sameSite**: Prevents cross-site request forgery

### **2. OAuth 2.0 Implementation**

#### **Google OAuth Flow**
```javascript
// Passport Strategy Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    // Handle user creation/login logic
}));
```

**Flow Steps:**
1. User clicks "Continue with Google"
2. Redirect to Google consent screen
3. User approves/denies access
4. Google redirects back with authorization code
5. Exchange code for access token
6. Fetch user profile data
7. Create/update user in database
8. Generate JWT and set cookie

### **3. Middleware-Based Authentication**

#### **Authentication Middleware Chain**
```javascript
// Check if user is authenticated (optional)
async function checkAuth(req, res, next) {
    const token = req.cookies?.uid;
    req.user = token ? verifyToken(token) : null;
    next();
}

// Require authentication (mandatory)
async function requireAuth(req, res, next) {
    if (!req.user) {
        return next(createUnauthorizedError());
    }
    next();
}

// Require resource ownership
async function requireAuthor(req, res, next) {
    const blog = await Blog.findById(req.params.id);
    if (blog.author.toString() !== req.user.id) {
        return next(createForbiddenError());
    }
    req.blog = blog;
    next();
}
```

### **4. Error Handling Architecture**

#### **Custom Error Classes**
```javascript
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
```

#### **Error Factory Functions**
```javascript
export const createValidationError = (message = 'Validation failed') => 
    new AppError(message, 400);

export const createNotFoundError = (resource = 'Resource') => 
    new AppError(`${resource} not found`, 404);
```

**Benefits:**
- Consistent error responses
- Centralized error handling
- Type-safe error creation
- Operational vs Programming error distinction

#### **Global Error Handler**
```javascript
function globalErrorHandler(error, req, res, next) {
    // Log all errors
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Handle different error types
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            error: error.message
        });
    }

    // Handle MongoDB errors
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Validation error: ' + error.message
        });
    }

    // Default error response
    return res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong!' 
            : error.message
    });
}
```

### **5. File Upload with Multer**

#### **Multer Configuration**
```javascript
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/blog-cover');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files allowed!'), false);
        }
    }
});
```

**Security Considerations:**
- File type validation
- Size limits
- Unique filename generation
- Safe storage location

### **6. Database Design & MongoDB**

#### **User Schema with OAuth Support**
```javascript
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function() {
            return !this.googleId && !this.githubId; // Password required if no OAuth
        }
    },
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
    authProvider: { 
        type: String, 
        enum: ['local', 'google', 'github'], 
        default: 'local' 
    }
});
```

#### **Embedded vs Referenced Documents**
```javascript
// Blog Schema with Embedded Comments and Likes
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referenced
    
    // Embedded approach for better performance
    likes: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }],
    likesCount: { type: Number, default: 0 },
    
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true, maxlength: 500 },
        createdAt: { type: Date, default: Date.now }
    }],
    commentsCount: { type: Number, default: 0 }
});

// Performance Indexes
blogSchema.index({ 'likes.user': 1 });
blogSchema.index({ likesCount: -1 });
blogSchema.index({ createdAt: -1 });
```

**Design Decision:** Embedded documents for comments/likes because:
- Frequently accessed together with blog
- Limited growth (comments won't exceed MongoDB's 16MB limit)
- Better read performance

---

## **Frontend Architecture & Implementation**

### **1. React Architecture Patterns**

#### **Custom Hooks for State Management**
```javascript
// useAuth.js - Authentication Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Usage in components
const { user, isAuthenticated, login, logout } = useAuth();
```

#### **Context API Implementation**
```javascript
// AuthContext.jsx
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/auth/me', {
                withCredentials: true
            });
            if (response.data.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        user, isLoading, isAuthenticated,
        login, logout, checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
```

### **2. Form Handling with React Hook Form**

#### **Advanced Form Validation**
```javascript
const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
} = useForm();

// Password confirmation validation
const password = watch("password", "");

<input
    {...register("confirmPassword", {
        required: "Please confirm your password",
        validate: value => value === password || "Passwords do not match"
    })}
/>
```

**Benefits:**
- Minimal re-renders
- Built-in validation
- Easy form reset
- TypeScript support

### **3. HTTP Client Configuration**

#### **Axios with Credentials**
```javascript
// Global axios configuration
const response = await axios.post('/user/login', data, {
    withCredentials: true  // Essential for cookie-based auth
});

// OAuth redirect handling
const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};
```

### **4. Route Protection**

#### **Protected Route Component**
```javascript
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) return <div>Loading...</div>;
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

// Usage
<Route path="/create-blog" element={
    <ProtectedRoute>
        <CreateBlog />
    </ProtectedRoute>
} />
```

### **5. UI/UX Implementation**

#### **Tailwind CSS with Custom Theme**
```css
/* Custom theme variables */
:root {
    --color-neon: #6EEB83;
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
}

@theme {
    --color-neon: #6EEB83;
}
```

#### **Framer Motion Animations**
```javascript
<motion.button 
    whileTap={{ scale: 0.95 }}
    className="..."
>
    {loading ? 'Creating...' : 'Sign Up'}
</motion.button>
```

---

## **Project-Specific Implementation Details**

### **1. File Structure & Organization**

```
CommitLog/
├── backend/
│   ├── config/         # Passport strategies
│   ├── controllers/    # Business logic
│   ├── middlewares/    # Auth, error handling
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── services/       # Utilities (auth, upload, hash)
│   └── utils/          # Error classes, factories
└── frontend/
    ├── components/     # Reusable UI components
    ├── contexts/       # Global state management
    ├── hooks/          # Custom React hooks
    ├── pages/          # Route components
    └── lib/            # Utilities
```

### **2. Environment Configuration**

#### **Backend (.env)**
```env
JWT_SECRET=your_jwt_secret
CommitLogDB=mongodb://localhost:27017/commitlog
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FRONTEND_URL=http://localhost:5173
```

#### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000
```

### **3. Deployment Considerations**

#### **Cookie Configuration for Production**
```javascript
res.cookie("uid", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
});
```

#### **CORS Configuration**
```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true    // Allow cookies
}));
```

---

## **Interview-Ready Explanations**

### **Common Questions & Answers**

#### **"Explain your authentication flow"**
**Answer:** "I implemented a hybrid authentication system supporting both traditional email/password and OAuth (Google/GitHub). For traditional auth, I hash passwords with bcrypt, generate JWT tokens, and store them in HTTP-only cookies for security. For OAuth, I use Passport.js strategies that handle the OAuth flow - redirecting to provider, handling callbacks, and either creating new users or linking to existing accounts. All authentication states are managed through a React Context API with a custom useAuth hook."

#### **"How do you handle errors in your application?"**
**Answer:** "I implemented a comprehensive error handling system with custom AppError classes for operational errors and factory functions for common error types. I have a global error handler middleware that catches all errors, logs them with context, and returns appropriate responses. For the frontend, I use try-catch blocks with user-friendly error messages and loading states."

#### **"Why did you choose MongoDB over SQL?"**
**Answer:** "For a blog platform, MongoDB's document structure is ideal because blog content varies greatly - some posts have images, others don't, comments can have different structures. The schema flexibility allows easy evolution. Also, embedding comments and likes within blog documents provides better read performance since they're always accessed together."

#### **"Explain your file upload implementation"**
**Answer:** "I used Multer for handling multipart form data. I configured disk storage with unique filename generation to prevent conflicts, implemented file type validation to only allow images, set size limits for security, and included proper error handling. For production, I'd migrate to cloud storage like AWS S3."

#### **"How do you ensure security?"**
**Answer:** "Multiple layers: JWT tokens in HTTP-only cookies prevent XSS, CORS configuration prevents unauthorized domains, input validation on both client and server, password hashing with bcrypt, file upload restrictions, and environment variable protection. I also implement authorization middleware to ensure users can only modify their own content."

### **Performance Optimizations**

#### **Database Indexing**
```javascript
// Blog schema indexes for common queries
blogSchema.index({ createdAt: -1 }); // Latest blogs first
blogSchema.index({ author: 1 });     // Blogs by author
blogSchema.index({ likesCount: -1 }); // Most liked blogs
```

#### **React Optimizations**
- Context API for global state (avoiding prop drilling)
- Custom hooks for reusable logic
- Lazy loading for route components
- Memoization for expensive calculations

### **Scalability Considerations**

#### **Database Scaling**
- Horizontal scaling with MongoDB sharding
- Read replicas for better performance
- Connection pooling
- Aggregation pipelines for complex queries

#### **Application Scaling**
- Stateless JWT authentication (server scaling)
- CDN for static assets
- Caching layer (Redis)
- Microservices architecture

#### **File Storage Scaling**
- Cloud storage (AWS S3, Cloudinary)
- Image optimization and compression
- CDN for media delivery