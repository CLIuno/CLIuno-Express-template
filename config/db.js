const sqlite3 = require("sqlite3").verbose();
const path = require('path');

// Database
const databasePath = path.join(__dirname, "../database", "myDatabase.db");
const db = new sqlite3.Database(databasePath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Connected to database.");
});


module.exports = db;