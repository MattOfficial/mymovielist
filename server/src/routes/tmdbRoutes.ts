import { Router } from "express";
import {
  getTrending,
  search,
  getDetails,
  getPopular,
} from "../controller/tmdbController";

const router = Router();

router.get("/trending", getTrending);
router.get("/search", search);
router.get("/:mediaType/:id", getDetails);
router.get("/:mediaType/popular", getPopular);

export default router;
