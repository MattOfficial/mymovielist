import sqlite3 from "sqlite3";
import path from "path";
import { Database } from "sqlite3";

// Resolve database file path to an absolute path
const dbPath = path.resolve(__dirname, "../../netflix.db");

const db: Database = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    process.exit(1); // Exit the process if the database connection fails
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
  }
});

db.serialize(() => {
  // User Lists table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      mediaId INTEGER NOT NULL,
      mediaType TEXT NOT NULL,
      listType TEXT NOT NULL,
      rating INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      UNIQUE(userId, mediaId)
    )
  `);

  // User Stats table for caching
  db.run(`
    CREATE TABLE IF NOT EXISTS user_stats (
      userId INTEGER PRIMARY KEY,
      totalWatched INTEGER DEFAULT 0,
      totalPlanToWatch INTEGER DEFAULT 0,
      totalDropped INTEGER DEFAULT 0,
      averageRating REAL DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
});

// Create users table
db.run(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    username TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`,
  (err) => {
    if (err) {
      console.error("Error creating users table:", err);
    } else {
      console.log("Users table created or already exists.");
    }
  }
);

// Export the database instance
export default db;
