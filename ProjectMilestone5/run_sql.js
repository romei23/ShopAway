const fs = require('fs');
const path = require('path');
const db = require('./db');

// Helper function to run SQL from a file
function runSQLFile(filename) {
    const filePath = path.join(__dirname, 'db', filename);
    const sql = fs.readFileSync(filePath, 'utf8');

    db.exec(sql, (err) => {
        if (err) {
            console.error(`❌ Error executing ${filename}:`, err.message);
        } else {
            console.log(`✅ Successfully executed ${filename}`);
        }
    });
}

// Run your SQL files
runSQLFile('create_table.sql');
runSQLFile('insert_users.sql');
// You can also run insert_categories.sql or insert_products.sql if needed
