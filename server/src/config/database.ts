import sqlite3 from "sqlite3";

const db = new sqlite3.Database("database.sqlite", (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to SQLite database");
    createTables();
  }
});

const createTables = () => {
  db.serialize(() => {
    // Enable foreign keys
    db.run("PRAGMA foreign_keys = ON");

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
          console.log("Users table created or already exists");
        }
      }
    );

    // Create user_lists table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS user_lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        media_id INTEGER NOT NULL,
        media_type TEXT CHECK(media_type IN ('movie', 'tv')) NOT NULL,
        list_type TEXT CHECK(list_type IN ('watching', 'plan_to_watch', 'dropped', 'completed')) NOT NULL,
        rating INTEGER CHECK(rating >= 0 AND rating <= 10),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `,
      (err) => {
        if (err) {
          console.error("Error creating user_lists table:", err);
        } else {
          console.log("User_lists table created or already exists");
        }
      }
    );
  });
};

export default db;
