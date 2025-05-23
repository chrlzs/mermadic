const User = require('../models/user');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const user = await User.create(username, email, password);

    // Return user without password
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Find user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await User.verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Set user in session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Logout user
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    // Get fresh user data from database
    const user = await User.findById(req.session.user.id);

    if (!user) {
      // User no longer exists in database
      req.session.destroy();
      return res.status(401).json({ message: 'User not found' });
    }

    // Update session with latest user data
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      profile_picture: user.profile_picture,
      auth_type: user.auth_type
    };

    res.json({ user: req.session.user });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
