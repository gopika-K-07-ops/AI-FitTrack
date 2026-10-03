import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { stats } from "../controllers/adminController.js";

const router = express.Router();
router.get("/stats", protect, adminOnly, stats);
export default router;
