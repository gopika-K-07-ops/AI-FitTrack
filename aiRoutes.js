import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/auth.js";
import { recommend } from "../controllers/aiController.js";

const router = express.Router();
router.post("/recommend", protect, body("prompt").trim().notEmpty(), recommend);
export default router;
