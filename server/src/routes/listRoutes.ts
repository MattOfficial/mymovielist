// listRoutes.ts
import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  addToList,
  getList,
  updateListItem,
  deleteListItem,
} from "../controller/listController";

const router = Router();

router.post("/", auth, addToList);
router.get("/:listType", auth, getList);
router.put("/:id", auth, updateListItem);
router.delete("/:id", auth, deleteListItem);

export default router;
