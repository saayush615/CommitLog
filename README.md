# CommitLog

CommitLog is a feature-rich developer blogging application that allows users to create, read, and interact with blog posts. The project demonstrates implementation of authentication, authorization, file uploads, rich text editing, and real-time interactions.

**YouTube Demo:** [Watch the demo](https://www.youtube.com/watch?v=JQ4uQZytA3A)

## ✨ Features

### Implemented Features

#### Authentication & Authorization
- **Local Authentication**: Email/password-based signup and login with JWT tokens
- **OAuth Integration**: Google and GitHub authentication using Passport.js
- **Protected Routes**: Route-level authorization for authenticated users
- **Role-based Access**: Users can only edit/delete their own content

#### Blog Management
- **Create Blogs**: Rich text editor (TipTap) with formatting options
- **View Blogs**: Detailed blog view with author information
- **Delete Blogs**: Users can delete their own blog posts
- **Cover Images**: Upload and display cover images for blog posts
- **Profile Page**: View all blogs created by the logged-in user

#### User Interactions
- **Like/Unlike**: Toggle likes on blog posts with real-time count updates
- **Comments**: Add comments on blog posts
- **Share**: Share blog posts with a shareable link

#### User Experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Toast Notifications**: Real-time feedback using React Toastify
- **Loading States**: Skeleton loaders and spinners for better UX
- **Error Handling**: Comprehensive error messages and fallback UI

### 🚧 Features In Progress

The following features are planned for future implementation:

- **Edit Blog**: Update existing blog posts
- **Comment Management**: Edit and delete comments
- **Profile Picture**: Upload, update, and delete profile pictures
- **Profile Settings**: Update user information (name, email, bio)
- **Search Functionality**: Search blogs by title or content
- **Categories/Tags**: Organize blogs with categories and tags
- **Pagination**: Paginate blog list for better performance

## 🛠️ Tech Stack

### Frontend
- **React** (v18.3.1) - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **TipTap** - Rich text editor
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form validation and handling
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Lucide React** - Icon library
- **Shadcn UI** - Pre-built UI components

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File upload handling
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
CommitLog/
├── backend/
│   ├── config/                   # Configuration files
│   │   └── passport.js           
│   ├── controllers/              # Route handlers
│   │   ├── blog.js               
│   │   └── user.js               
│   ├── middlewares/             # Custom middlewares
│   │   ├── auth.js              # Authentication & authorization middleware
│   │   └── errorHandler.js      # Global error handling
│   ├── models/                  # Mongoose schemas
│   │   ├── blog.js               
│   │   └── user.js               
│   ├── routes/                   # Api routes
│   │   ├── auth.js               # OAuth routes
│   │   ├── blog.js               
│   │   └── user.js               
│   ├── services/                 # Business logic
│   │   ├── auth.js               # JWT token generation/verification
│   │   ├── hash.js               # Password hashing utilities
│   │   └── upload.js             # Multer configuration
│   ├── uploads/
│   │   └── blog-cover/           # Uploaded cover images
│   ├── utils/                    # Helper functions
│   │   └── errorFactory.js       # Custom error classes
│   ├── .env                      # Environment variables
│   ├── index.js                  # Server entry point
│   └── package.json
│
└── frontend/
    ├── public/                   # Static assets
    ├── src/
    │   ├── assets/               # Images, logos, SVGs
    │   ├── components/
    │   │   ├── ui/               # Shadcn UI components
    │   │   ├── TextEditor/       # TipTap editor components
    │   │   ├── AlertDialogue.jsx
    │   │   ├── AuthLayout.jsx    # Authentication page layout
    │   │   ├── BlogActionSidebar.jsx
    │   │   ├── Card.jsx          # Blog card component
    │   │   ├── CommentBox.jsx
    │   │   ├── CommentCard.jsx
    │   │   ├── Layout.jsx        # Main app layout
    │   │   ├── Navbar.jsx
    │   │   ├── ShareDialog.jsx
    │   │   └── Sidebar.jsx
    │   ├── contexts/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── hooks/
    │   │   └── useAuth.js        # Custom auth hook
    │   ├── lib/
    │   │   └── utils.js          # Helper utilities
    │   ├── pages/
    │   │   ├── CreateBlog.jsx
    │   │   ├── EditBlog.jsx      # (In Progress)
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Signup.jsx
    │   │   └── ViewBlog.jsx
    │   ├── utils/
    │   │   ├── dateUtils.js      # Date formatting utilities
    │   │   └── textUtils.js      # Text manipulation utilities
    │   ├── App.jsx               # Root component with routes
    │   └── main.jsx              # App entry point
    ├── .env                      # Frontend environment variables
    ├── components.json           # Shadcn UI configuration
    ├── package.json
    ├── tailwind.config.js        # Tailwind CSS configuration
    └── vite.config.js            # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: local installation or MongoDB Atlas.
- **Google Cloud Console Project**: Required for Google OAuth setup


### Backend Setup
   1. Navigate to backend directory:
   ```bash
   cd backend
   ```
   2. Install dependencies:
   ```bash
   npm install
   ```

   3. Create a `.env` file in the `backend` directory:
   ```bash
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   CommitLogDB=mongodb://localhost:27017/commitlog
   FRONTEND_URL=http://localhost:5173

   #Google oAuth Config
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Add GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```
   4. Start the server:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3000`

### Frontend Setup

   1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
   2. Install dependencies:
   ```bash
   npm install
   ```
   3. Create a `.env` file in the `frontend` directory:
   ```bash
   VITE_API_URL=http://localhost:3000
   ```
   4. Start the development server:
   ```bash
   npm run dev
   ```
   App will run on `http://localhost:5173`

### 🔐 OAuth Setup

To enable Google and GitHub authentication:

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env` file

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/auth/github/callback`
4. Copy Client ID and Client Secret to `.env` file

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user` | User signup | No |
| POST | `/user/login` | User login | No |
| GET | `/user/logout` | User logout | No |
| GET | `/auth/google` | Initiate Google OAuth | No |
| GET | `/auth/google/callback` | Google OAuth callback | No |
| GET | `/auth/github` | Initiate GitHub OAuth | No |
| GET | `/auth/github/callback` | GitHub OAuth callback | No |

### Blog Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/blog/read` | Get all blogs | No |
| GET | `/blog/read/:id` | Get single blog with interactions | No |
| POST | `/blog/create` | Create new blog | Yes |
| PUT | `/blog/update/:id` | Update blog | Yes (Author) |
| DELETE | `/blog/delete/:id` | Delete blog | Yes (Author) |
| POST | `/blog/:id/like` | Like/unlike blog | Yes |
| POST | `/blog/:id/comment` | Add comment | Yes |
| DELETE | `/blog/:id/comment/:commentId` | Delete comment | Yes |

## 🎨 Key Features Explained

### Authentication Flow
- **JWT-based**: Tokens stored in HTTP-only cookies for security
- **Hybrid Auth**: Supports both local and OAuth authentication
- **Middleware Chain**: `checkAuth` → `requireAuth` → `requireAuthor`

### Error Handling
- **Custom Error Classes**: `AppError` for operational errors
- **Error Factory Functions**: Consistent error creation
- **Global Error Handler**: Centralized error processing
- **Client-side Error Display**: Toast notifications with user-friendly messages

### File Upload
- **Multer Configuration**: Disk storage with unique filenames
- **File Validation**: Type and size restrictions
- **Error Handling**: Cleanup on upload failure
- **Static Serving**: Express middleware for uploaded files

### Database Design
- **Embedded Documents**: Comments and likes embedded in blog documents
- **Indexes**: Performance optimization for common queries
- **Population**: Referenced user data populated on queries
- **Sparse Indexes**: Unique OAuth IDs with null support

## 🧪 Testing

The application can be tested manually using:
- **Postman**: For API endpoint testing
- **Browser DevTools**: For frontend debugging
- **MongoDB Compass**: For database inspection

## 🐛 Known Issues

- Edit blog functionality not yet implemented
- Comment editing/deletion needs to be added
- Profile picture upload pending
- No pagination for large blog lists
- Sidebar on mobile. Not working

## 🔮 Future Enhancements

- Implement blog editing functionality
- Add comment management (edit/delete)
- Profile picture upload and management
- User profile settings page
- Search and filter functionality
- Categories and tags system
- Rich text preview mode
- Draft saving functionality
- Email verification
- Password reset flow
- Social sharing with OG tags
- Analytics dashboard
- Dark/light theme toggle

## 📝 Learning Outcomes

This project helped me learn:

- **Full-stack Development**: Building both frontend and backend
- **REST API Design**: Creating RESTful endpoints
- **Authentication**: JWT tokens and OAuth integration
- **Database Design**: MongoDB schema design and relationships
- **State Management**: React Context API for global state
- **Form Handling**: React Hook Form with validation
- **File Uploads**: Multer for multipart form data
- **Error Handling**: Comprehensive error management
- **Security**: Password hashing, CORS, HTTP-only cookies
- **UI/UX**: Responsive design with animations

## 🤝 Contributing

This is a learning project, but suggestions and feedback are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 🙏 Credit & Acknowledgments

### UI Design
The visual design and user interface of this project are based on the excellent work of **[Somnath Das](https://www.figma.com/@somnathdas)**. Their design is publicly available and free to use.

- **Designer:** [Somnath Das](https://www.figma.com/@somnathdas)
- **Original Design:** [nLog a Blogging website](https://www.figma.com/community/file/1118764549305878223/nlog-a-blogging-website)

Special thanks for creating such a beautiful and functional design that made this learning project possible!

### Technologies
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TipTap Editor](https://tiptap.dev/)

## 📄 License

This project is intended solely for educational purposes.

## Author

Built with ❤️ as a full-stack learning project.
