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