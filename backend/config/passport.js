import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import USER from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

// configure google oAuth stratergy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {   // If you ever need to use this inside the callback (for example, to access strategy options), use the regular function. Otherwise, arrow functions are fine.
    try {
        console.log('Google profile:', profile);  //Debugging

        // 1. Check if user alredy exist with this GoogleId
        let user = await USER.findOne({ googleId: profile.id });

        if(user) {
            return done(null, user); // err = null, return only user
        }

        // 2. check if user exists with same email
        const emailUser = await USER.findOne({
            email: profile.emails[0].value
        });

        if (emailUser){
            // Link google account to existing user
            emailUser.googleId = profile.id;
            emailUser.authProvider = 'google';
            authProvider.profilePicture = profile.photos[0]?.value;
            await emailUser.save();
            return done(null, emailUser);
        }

        // 3. Create new user with Google data
        user = await USER.create({
            googleId: profile.id,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            username: profile.emails[0].value.split('@')[0] + '_' + Date.now(),  //Ensure unique username
            email: profile.emails[0].value,
            authProvider: 'google',
            profilePicture: profile.photos[0]?.value
        });

        done(null, user);
    } catch (error) {
        console.error('Google Auth Error:', error);
        done(error, null);
    }
  }
));


// Configure Github oAuth strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Github profile:', profile); //debugging

        // 1. check if Github.id alreay exists
        let user = await USER.findOne({ githubId: profile.id });

        if (user) {
            return done(null,user);
        }

        // 2. check if user exists with same email
        const emailUser = await USER.findOne({
            email: profile.emails?.[0]?.value || `${profile.username}@github.local`
        });

        if (emailUser){
            emailUser.githubId = profile.id;
            emailUser.authProvider = 'github';
            emailUser.profilePicture = profile.photos[0]?.value;
            await emailUser.save();
            return done(null, emailUser);
        }

        // 3. Create new user with Github data
        // Github might not provide email, so we handle that case
        const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;

        user = await USER.create({
            githubId: profile.id,
            firstname: profile.displayName?.split(' ')[0] || profile.username,
            lastname: profile.displayName?.split(' ')[1] || 'User',
            username: profile.username + '_github_' + Date.now(),
            email: email,
            authProvider: 'github',
            profilePicture: profile.photos[0]?.value
        });

        done(null, user);
    } catch (error){
        console.log('Github Auth error:', error);
        return done(error,null);
    }
  }
));



export default passport;