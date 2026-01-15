import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/v1/auth/google/callback", 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user already exists
        let user = await User.findOne({ 
           $or: [{ googleId: profile.id }, { email: profile.emails?.[0].value }] 
        });

        if (user) {
          // If user exists but has no googleId (registered via email before), link them
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // 2. If no user, create a new one (Default role: Patient)
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          googleId: profile.id,
          role: 'patient', // Safety default
          verificationStatus: 'idle'
        });

        return done(null, newUser);
      } catch (error: any) {
        return done(error, false);
      }
    }
  )
);

export default passport;