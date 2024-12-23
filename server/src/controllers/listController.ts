// server/src/controllers/listController.ts
import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import db from "../config/database";

export const getUserLists = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    db.all(
      `SELECT * FROM user_lists WHERE userId = ?`,
      [userId],
      (err, lists) => {
        if (err) {
          return res.status(500).json({ message: "Server error" });
        }
        res.json(lists);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addToList = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { mediaId, mediaType, listType, rating } = req.body;

    db.run(
      `INSERT INTO user_lists (userId, mediaId, mediaType, listType, rating)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, mediaId, mediaType, listType, rating],
      function (err) {
        if (err) {
          return res.status(500).json({ message: "Server error" });
        }
        res.json({ id: this.lastID });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromList = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { mediaId } = req.params;

    db.run(
      `DELETE FROM user_lists WHERE userId = ? AND mediaId = ?`,
      [userId, mediaId],
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Server error" });
        }
        res.json({ message: "Removed from list" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRating = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { mediaId } = req.params;
    const { rating } = req.body;

    db.run(
      `UPDATE user_lists SET rating = ? WHERE userId = ? AND mediaId = ?`,
      [rating, userId, mediaId],
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Server error" });
        }
        res.json({ message: "Rating updated" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
