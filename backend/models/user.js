const db = require('../db');
const bcrypt = require('bcrypt');

class User {
  // Create a new local user
  static async create(username, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (username, email, password, auth_type) VALUES (?, ?, ?, ?)`;
        db.run(sql, [username, email, hashedPassword, 'local'], function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID, username, email, auth_type: 'local' });
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // Create or find a user from Google profile
  static async findOrCreateGoogleUser(profile) {
    console.log('Finding or creating user from Google profile');
    console.log('Profile:', JSON.stringify(profile, null, 2));

    const { id, displayName, emails, photos } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;
    const profilePicture = photos && photos.length > 0 ? photos[0].value : null;

    console.log('Extracted from profile:', { id, displayName, email, profilePicture });

    if (!email) {
      console.error('No email found in Google profile');
      throw new Error('Email is required from Google profile');
    }

    try {
      // Check if user already exists with this Google ID
      console.log('Checking if user exists with Google ID:', id);
      const existingUser = await this.findByGoogleId(id);
      if (existingUser) {
        console.log('User found with Google ID:', existingUser);
        return existingUser;
      }

      // Check if user exists with this email
      console.log('Checking if user exists with email:', email);
      const userByEmail = await this.findByEmail(email);
      if (userByEmail) {
        console.log('User found with email, updating with Google info:', userByEmail);
        // Update user with Google info
        return await this.updateGoogleInfo(userByEmail.id, id, profilePicture);
      }

      // Create new user with Google info
      console.log('Creating new user with Google info');
      return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (username, email, google_id, profile_picture, auth_type) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [displayName, email, id, profilePicture, 'google'], function(err) {
          if (err) {
            console.error('Error creating user with Google info:', err);
            reject(err);
            return;
          }
          const newUser = {
            id: this.lastID,
            username: displayName,
            email,
            google_id: id,
            profile_picture: profilePicture,
            auth_type: 'google'
          };
          console.log('New user created:', newUser);
          resolve(newUser);
        });
      });
    } catch (error) {
      console.error('Error in findOrCreateGoogleUser:', error);
      throw error;
    }
  }

  // Find user by username
  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE username = ?`;
      db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  // Find user by ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, username, email, profile_picture, auth_type, created_at FROM users WHERE id = ?`;
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Find user by email
  static findByEmail(email) {
    console.log('Finding user by email:', email);
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE email = ?`;
      db.get(sql, [email], (err, row) => {
        if (err) {
          console.error('Error finding user by email:', err);
          reject(err);
          return;
        }
        console.log('Result of finding user by email:', row);
        resolve(row);
      });
    });
  }

  // Find user by Google ID
  static findByGoogleId(googleId) {
    console.log('Finding user by Google ID:', googleId);
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE google_id = ?`;
      db.get(sql, [googleId], (err, row) => {
        if (err) {
          console.error('Error finding user by Google ID:', err);
          reject(err);
          return;
        }
        console.log('Result of finding user by Google ID:', row);
        resolve(row);
      });
    });
  }

  // Update user with Google info
  static updateGoogleInfo(userId, googleId, profilePicture) {
    console.log('Updating user with Google info:', { userId, googleId, profilePicture });
    return new Promise((resolve, reject) => {
      const sql = `UPDATE users SET google_id = ?, profile_picture = ?, auth_type = ? WHERE id = ?`;
      db.run(sql, [googleId, profilePicture, 'google', userId], function(err) {
        if (err) {
          console.error('Error updating user with Google info:', err);
          reject(err);
          return;
        }
        console.log('User updated with Google info, rows affected:', this.changes);

        // Get the updated user
        User.findById(userId)
          .then(user => {
            console.log('Updated user retrieved:', user);
            resolve(user);
          })
          .catch(err => {
            console.error('Error retrieving updated user:', err);
            reject(err);
          });
      });
    });
  }
}

module.exports = User;
