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
    const { id, displayName, emails, photos } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;
    const profilePicture = photos && photos.length > 0 ? photos[0].value : null;

    if (!email) {
      throw new Error('Email is required from Google profile');
    }

    try {
      // Check if user already exists with this Google ID
      const existingUser = await this.findByGoogleId(id);
      if (existingUser) {
        return existingUser;
      }

      // Check if user exists with this email
      const userByEmail = await this.findByEmail(email);
      if (userByEmail) {
        // Update user with Google info
        return await this.updateGoogleInfo(userByEmail.id, id, profilePicture);
      }

      // Create new user with Google info
      return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (username, email, google_id, profile_picture, auth_type) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [displayName, email, id, profilePicture, 'google'], function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({
            id: this.lastID,
            username: displayName,
            email,
            google_id: id,
            profile_picture: profilePicture,
            auth_type: 'google'
          });
        });
      });
    } catch (error) {
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
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE email = ?`;
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  // Find user by Google ID
  static findByGoogleId(googleId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE google_id = ?`;
      db.get(sql, [googleId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  // Update user with Google info
  static updateGoogleInfo(userId, googleId, profilePicture) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE users SET google_id = ?, profile_picture = ?, auth_type = ? WHERE id = ?`;
      db.run(sql, [googleId, profilePicture, 'google', userId], function(err) {
        if (err) {
          reject(err);
          return;
        }

        // Get the updated user
        User.findById(userId)
          .then(user => resolve(user))
          .catch(err => reject(err));
      });
    });
  }
}

module.exports = User;
