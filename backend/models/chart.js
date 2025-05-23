const db = require('../db');
const crypto = require('crypto');

class Chart {
  // Create a new chart
  static create(userId, title, content, isPublic = false) {
    const shareId = crypto.randomBytes(8).toString('hex');
    
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO charts (user_id, title, content, public, share_id) 
                  VALUES (?, ?, ?, ?, ?)`;
      db.run(sql, [userId, title, content, isPublic ? 1 : 0, shareId], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ 
          id: this.lastID, 
          user_id: userId, 
          title, 
          content, 
          public: isPublic,
          share_id: shareId
        });
      });
    });
  }

  // Get chart by ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM charts WHERE id = ?`;
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  // Get chart by share ID
  static findByShareId(shareId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM charts WHERE share_id = ?`;
      db.get(sql, [shareId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  // Get all charts for a user
  static findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM charts WHERE user_id = ? ORDER BY updated_at DESC`;
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  // Update a chart
  static update(id, title, content, isPublic) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE charts 
                  SET title = ?, content = ?, public = ?, updated_at = CURRENT_TIMESTAMP 
                  WHERE id = ?`;
      db.run(sql, [title, content, isPublic ? 1 : 0, id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ changes: this.changes });
      });
    });
  }

  // Delete a chart
  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM charts WHERE id = ?`;
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ changes: this.changes });
      });
    });
  }
}

module.exports = Chart;
