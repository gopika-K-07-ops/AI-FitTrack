import express from "express";
import { protect } from "../middleware/auth.js";
import { listGoals, createGoal } from "../controllers/goalController.js";

const router = express.Router();
router.use(protect);
router.get("/", listGoals);
router.post("/", createGoal);

export default router;
