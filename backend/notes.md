# CommitLog Backend notes

## **1. OAuth 2.0 vs OpenID Connect: The Simple Explanation**
Think of **OAuth** 2.0 as a **security guard** that lets you into a building, while **OpenID Connect** is like a receptionist who not only lets you in but also tells everyone who you are.

OAuth 2.0 (passport-google-oauth20)
- **Purpose**: Originally designed for authorization (what you can access)
- **What you get**: Access tokens to use Google's services
- **User info**: You have to make a separate API call to get user details
- **Age**: Older, more established

OpenID Connect (passport-google-oidc)
- **Purpose**: Built specifically for authentication (who you are)
- **What you get**: ID tokens that already contain user information
- **User info**: User details come built-in with the authentication
- **Age**: Newer, modern standard

### For Your Blog App: Which Should You Use?
> Use passport-google-oauth20 because:

- You just need user login - You don't need to access Google Drive,Gmail, etc.
- Mature ecosystem - More tutorials, Stack Overflow answers
- Better compatibility - Works well with your current setup
- Community support - 200k+ downloads vs 3k shows widespread adoption

## **2. Passportjs stratergies**

### Parameters
- **accessToken**: Token to access Google APIs on behalf of the user (short-lived)
- **refreshToken**: Token to get a new accessToken when it expires (long-lived, only sent on first login)
- **profile**: User profile info from Google (id, name, email, photo, etc.)
- **done**: Callback to pass user data to Passport for session handling

> In arrow functions (() => {}), this does not refer to the current object, so always use regular functions (function() {}) when you need this in Mongoose schemas.

### Serialization 

Serialization is the process of converting a user object into a unique identifier (usually the user’s ID) that can be stored in the session

- When a user logs in, Passport calls **serializeUser**.
- It takes the user object and stores only **user._id** in the session.
- This means the session only remembers the **user's ID**, not the whole user object.

```JS
passport.serializeUser((user,done) => { 
    done(null, user._id);
 });
```

### Deserialization
Deserialization is the process of taking the stored user ID from the session and fetching the full user object from the database for each request.

- When a request comes in, Passport calls **deserializeUser**.
- It uses the stored ID to look up the full user object in the database.
- The full user object is then attached to **req.user** for use in your routes.

```JS
passport.deserializeUser(async (id, done) => {
    try {
        const user = await USER.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
```

### What is Express-Session?
Express-session is a *middleware* that manages **server-side sessions** for Express applications.

Core Concept:
- **Client gets**: A session ID (stored in cookie)
- **Server stores**: Actual session data (in memory/database)
- **Connection**: Session ID links client to their server-side data

## **3. Cookie Security Configuration Fields**
1. *httpOnly: true*
    - **Purpose**: Prevents client-side JavaScript from accessing the cookie
    - **Security**: Protects against XSS (Cross-Site Scripting) attacks
    - **What it does**: Cookie can only be accessed by the server, not by *document.cookie* in browser
    - Industry standard: Always *true* for authentication tokens
2. *secure: process.env.NODE_ENV === 'production'*
    - **Purpose**: Cookie only sent over HTTPS connections
    - **Security**: Prevents token interception over unsecured HTTP
    - **What it does**:
        - **true** in production → Cookie only sent via HTTPS
        - **false** in development → Allows HTTP (for localhost testing)
    - **Industry standard**: Always true in production environments
3. *sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'*
    - **Purpose**: Controls when cookies are sent with cross-site requests
    - **Security**: Protects against CSRF (Cross-Site Request Forgery) attacks
    - **Options**:
        - **'strict'**: Cookie never sent with cross-site requests (most secure)
        - **'lax'**: Cookie sent with top-level navigation (like clicking links)
        - **'none'**: Cookie always sent (requires secure: true)
    - What it does:
        - **Production**: 'strict' → Maximum CSRF protection
        - **Development**: 'lax' → Allows easier testing between frontend/backend
4. *maxAge: 24 * 60 * 60 * 1000*
- **Purpose**: Sets cookie expiration time in milliseconds
- **Calculation**: 24 hours × 60 minutes × 60 seconds × 1000 milliseconds = 86,400,000ms