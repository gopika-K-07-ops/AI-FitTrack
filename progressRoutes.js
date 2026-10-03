import express from "express";
import { protect } from "../middleware/auth.js";
import { summary } from "../controllers/progressController.js";

const router = express.Router();
router.get("/summary", protect, summary);
export default router;
