import express from "express";
import { auth } from "../middleware/auth";
import {
  getUserLists,
  addToList,
  removeFromList,
  updateRating,
} from "../controllers/listController";

const router = express.Router();

router.get("/", auth, getUserLists);
router.post("/add", auth, addToList);
router.delete("/:mediaId", auth, removeFromList);
router.put("/rating/:mediaId", auth, updateRating);

export default router;
