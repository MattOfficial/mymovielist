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
