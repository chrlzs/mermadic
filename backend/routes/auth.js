const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth login route
router.get('/google', (req, res, next) => {
  console.log('Google authentication route accessed');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback',
  (req, res, next) => {
    console.log('Google callback route accessed');
    console.log('Query parameters:', req.query);

    // Check if there's an error in the query parameters
    if (req.query.error) {
      console.error('Error in Google callback:', req.query.error);
      return res.redirect('/login.html?error=' + req.query.error);
    }

    next();
  },
  (req, res, next) => {
    console.log('About to authenticate with passport');
    // Wrap passport.authenticate in a try-catch to catch any errors
    try {
      passport.authenticate('google', {
        failureRedirect: '/login.html?error=google-auth-failed'
      })(req, res, next);
    } catch (error) {
      console.error('Error during passport authentication:', error);
      return res.redirect('/login.html?error=passport-error');
    }
  },
  (req, res) => {
    console.log('Google authentication successful');
    console.log('User:', req.user);

    // Successful authentication
    // Set user in session
    req.session.user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      profile_picture: req.user.profile_picture,
      auth_type: req.user.auth_type
    };

    console.log('Session user set:', req.session.user);

    // Redirect to dashboard
    res.redirect('/dashboard.html');
  }
);

module.exports = router;
