import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret-key"; // In production, use environment variables

interface AuthRequest extends Request {
  user?: { id: number };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};
