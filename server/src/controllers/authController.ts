import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database";
import type { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const register = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  try {
    // Check if user exists
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ message: "Server error" });
        }
        if (user) {
          return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        db.run(
          "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
          [email, hashedPassword, username],
          function (err) {
            if (err) {
              return res.status(500).json({ message: "Server error" });
            }

            const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, {
              expiresIn: "24h",
            });

            res.json({ token });
          }
        );
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user: User) => {
        if (err) {
          return res.status(500).json({ message: "Server error" });
        }
        if (!user) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
          expiresIn: "24h",
        });

        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
