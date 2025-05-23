const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login.html?error=google-auth-failed' 
  }),
  (req, res) => {
    // Successful authentication
    // Set user in session
    req.session.user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      profile_picture: req.user.profile_picture,
      auth_type: req.user.auth_type
    };
    
    // Redirect to dashboard
    res.redirect('/dashboard.html');
  }
);

module.exports = router;
