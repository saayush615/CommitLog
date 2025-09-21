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
  async (accessToken, refreshToken, profile, done) => {
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

// Serialize user for session storage
passport.serializeUser((user,done) => { 
    done(null, user._id);
 });

//  Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await USER.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;