## 1. Workflow of Authentication
Normal email/password login flow
````
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │    DATABASE     │
│  (Login.jsx)    │    │   (index.js)    │    │   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
    1.   │ POST /user/login       │                        │
         │ {usernameOrEmail,      │                        │
         │  password}             │                        │
         ├───────────────────────►│                        │
         │                        │                        │
    2.   │                        │ Find user by email/    │
         │                        │ username               │
         │                        ├───────────────────────►│
         │                        │                        │
    3.   │                        │ Return user object     │
         │                        │◄───────────────────────┤
         │                        │                        │
    4.   │                        │ Compare password       │
         │                        │ with bcrypt            │
         │                        │                        │
    5.   │                        │ Generate JWT token     │
         │                        │                        │
    6.   │                        │ Set HTTP-only cookie   │
         │                        │ (uid=token)            │
         │                        │                        │
    7.   │ Response: success      │                        │
         │◄───────────────────────┤                        │
         │                        │                        │
    8.   │ Redirect to homepage   │                        │
         │ navigate('/')          │                        │
         │                        │                        │
    ═══════════════════════════════════════════════════════════
    📍 SUBSEQUENT REQUESTS (How req.user is populated)
    ═══════════════════════════════════════════════════════════
         │                        │                        │
    9.   │ GET / (any request)    │                        │
         │ Cookie: uid=jwt_token  │                        │
         ├───────────────────────►│                        │
         │                        │                        │
   10.   │                        │ checkAuth middleware   │
         │                        │ extracts cookie        │
         │                        │                        │
   11.   │                        │ verifyToken(jwt)       │
         │                        │ decodes user info      │
         │                        │                        │
   12.   │                        │ **req.user** = decoded │
         │                        │ user data              │
         │                        │                        │
   13.   │                        │ Continue to route      │
         │                        │ handler                │
         │                        │                        │
````
Google/Github Login flow 
````
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │   GOOGLE/GITHUB │    │    DATABASE     │
│  (Login.jsx)    │    │   (index.js)    │    │     SERVERS     │    │   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │                        │
    1.   │ Click "Continue with   │                        │                        │
         │ Google"                │                        │                        │
         │                        │                        │                        │
    2.   │ Redirect to:           │                        │                        │
         │ /auth/google           │                        │                        │
         ├───────────────────────►│                        │                        │
         │                        │                        │                        │
    3.   │                        │ Passport redirects to  │                        │
         │                        │ Google consent screen  │                        │
         │                        ├───────────────────────►│                        │
         │                        │                        │                        │
    4.   │ User sees Google       │                        │                        │
         │ login page             │                        │                        │
         │◄───────────────────────┼────────────────────────┤                        │
         │                        │                        │                        │
    5.   │ User approves access   │                        │                        │
         ├────────────────────────┼───────────────────────►│                        │
         │                        │                        │                        │
    6.   │                        │ Google redirects back  │                        │
         │                        │ to /auth/google/       │                        │
         │                        │ callback with code     │                        │
         │                        │◄───────────────────────┤                        │
         │                        │                        │                        │
    7.   │                        │ Passport exchanges     │                        │
         │                        │ code for access token  │                        │
         │                        ├───────────────────────►│                        │
         │                        │                        │                        │
    8.   │                        │ Get user profile       │                        │
         │                        │ data                   │                        │
         │                        │◄───────────────────────┤                        │
         │                        │                        │                        │
    9.   │                        │ Check if user exists   │                        │
         │                        │ by googleId            │                        │
         │                        ├───────────────────────────────────────────────►│
         │                        │                        │                        │
   10.   │                        │ If not exists, create  │                        │
         │                        │ new user               │                        │
         │                        │◄───────────────────────────────────────────────┤
         │                        │                        │                        │
   11.   │                        │ Generate JWT token     │                        │
         │                        │                        │                        │
   12.   │                        │ Set HTTP-only cookie   │                        │
         │                        │                        │                        │
   13.   │ Redirect to frontend   │                        │                        │
         │ with success           │                        │                        │
         │◄───────────────────────┤                        │                        │
         │                        │                        │                        │
    ═══════════════════════════════════════════════════════════════════════════════════
    📍 SUBSEQUENT REQUESTS (How req.user is populated - SAME AS NORMAL LOGIN)
    ═══════════════════════════════════════════════════════════════════════════════════
         │                        │                        │                        │
   14.   │ GET / (any request)    │                        │                        │
         │ Cookie: uid=jwt_token  │                        │                        │
         ├───────────────────────►│                        │                        │
         │                        │                        │                        │
   15.   │                        │ checkAuth middleware   │                        │
         │                        │ extracts cookie        │                        │
         │                        │                        │                        │
   16.   │                        │ verifyToken(jwt)       │                        │
         │                        │ decodes user info      │                        │
         │                        │                        │                        │
   17.   │                        │ req.user = decoded     │                        │
         │                        │ user data              │                        │
         │                        │                        │                        │
````