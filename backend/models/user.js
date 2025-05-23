const db = require('../db');
const bcrypt = require('bcrypt');

class User {
  // Create a new user
  static async create(username, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
        db.run(sql, [username, email, hashedPassword], function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID, username, email });
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
      const sql = `SELECT id, username, email, created_at FROM users WHERE id = ?`;
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
}

module.exports = User;
