const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

// Register a new user
router.post('/register', userController.register);

// Login user
router.post('/login', userController.login);

// Logout user
router.post('/logout', userController.logout);

// Get current user
router.get('/me', isAuthenticated, userController.getCurrentUser);

module.exports = router;
