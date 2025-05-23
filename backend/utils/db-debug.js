const db = require('../db');

// Function to check database schema
function checkDatabaseSchema() {
  console.log('Checking database schema...');
  
  // Check users table schema
  db.all(`PRAGMA table_info(users)`, (err, rows) => {
    if (err) {
      console.error('Error checking users table schema:', err);
      return;
    }
    console.log('Users table schema:', rows);
  });
  
  // Check if any users exist
  db.all(`SELECT * FROM users LIMIT 5`, (err, rows) => {
    if (err) {
      console.error('Error checking users:', err);
      return;
    }
    console.log('Sample users in database:', rows);
  });
}

module.exports = { checkDatabaseSchema };
