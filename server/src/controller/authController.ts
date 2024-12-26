import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database";

const JWT_SECRET = "your-secret-key";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    // Add input validation
    if (!email || !password || !username) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["email", "password", "username"],
        received: req.body,
      });
    }

    // Add email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Add password validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // Add username validation
    if (username.length < 3) {
      return res
        .status(400)
        .json({ error: "Username must be at least 3 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    // First check if email already exists
    db.get("SELECT email FROM users WHERE email = ?", [email], (err, user) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (user) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // If email doesn't exist, create new user
      db.run(
        "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
        [email, hashedPassword, username],
        function (err) {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Error creating user" });
          }

          const token = jwt.sign({ id: this.lastID }, JWT_SECRET);
          res.status(201).json({
            message: "User created successfully",
            token,
            userId: this.lastID,
          });
        }
      );
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user: any) => {
        if (err || !user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(400).json({ error: "Error logging in" });
  }
};
