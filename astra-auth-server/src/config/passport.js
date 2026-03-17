import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_ORIGIN || 'http://localhost:4001'}/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) return done(new Error('No email returned from Google'));

        // Check if user already exists (by googleId or email)
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Try to link to existing email/password account
          user = await User.findOne({ email });
          if (user) {
            // Link Google to existing account
            user.googleId = profile.id;
            await user.save();
          } else {
            // Create brand new Google user
            user = await User.create({
              name: profile.displayName || email.split('@')[0],
              email,
              googleId: profile.id,
              // passwordHash intentionally omitted – Google users have no local password
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Minimal session serialisation (only used during the OAuth redirect dance)
passport.serializeUser((user, done) => done(null, user._id.toString()));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
