const path = require('path');

const betterSqlite3 = require('better-sqlite3');

const databasePath = path.join(__dirname, "../database", "myDatabase.db");

const db = new betterSqlite3(databasePath, { verbose: console.log("Connnected to database.") });

module.exports = db;
