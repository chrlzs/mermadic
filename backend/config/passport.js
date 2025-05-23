const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  console.log('Google authentication callback received');
  console.log('Profile:', JSON.stringify(profile, null, 2));

  try {
    // Find or create user with Google profile
    console.log('Attempting to find or create user with Google profile');
    const user = await User.findOrCreateGoogleUser(profile);
    console.log('User found or created:', user);
    return done(null, user);
  } catch (error) {
    console.error('Error in Google authentication:', error);
    return done(error, null);
  }
}));

module.exports = passport;
