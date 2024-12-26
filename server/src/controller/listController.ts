import type { Request, Response } from "express";
import db from "../config/database";

interface AuthRequest extends Request {
  user?: { id: number };
}

export const addToList = async (req: AuthRequest, res: Response) => {
  try {
    const { mediaId, mediaType, listType, rating = 0 } = req.body;
    const userId = req.user?.id;

    db.run(
      `INSERT INTO user_lists (user_id, media_id, media_type, list_type, rating)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, mediaId, mediaType, listType, rating],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(400).json({ error: "Error adding to list" });
        }
        res.status(201).json({ id: this.lastID });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error adding to list" });
  }
};

export const getList = async (req: AuthRequest, res: Response) => {
  try {
    const { listType } = req.params;
    const userId = req.user?.id;

    db.all(
      "SELECT * FROM user_lists WHERE user_id = ? AND list_type = ?",
      [userId, listType],
      (err, items) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ error: "Error getting list" });
        }
        res.json(items);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error getting list" });
  }
};

export const updateListItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { listType, rating } = req.body;
    const userId = req.user?.id;

    db.run(
      `UPDATE user_lists 
       SET list_type = ?, rating = ?
       WHERE id = ? AND user_id = ?`,
      [listType, rating, id, userId],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(400).json({ error: "Error updating list item" });
        }
        res.json({ success: true });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error updating list item" });
  }
};

export const deleteListItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    db.run(
      "DELETE FROM user_lists WHERE id = ? AND user_id = ?",
      [id, userId],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(400).json({ error: "Error deleting list item" });
        }
        res.json({ success: true });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error deleting list item" });
  }
};
