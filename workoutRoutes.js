import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/auth.js";
import {
  listWorkouts, createWorkout, updateWorkout, deleteWorkout, completeWorkout
} from "../controllers/workoutController.js";

const router = express.Router();
router.use(protect);

router.get("/", listWorkouts);
router.post("/", [
  body("title").trim().notEmpty(),
  body("duration").isInt({ min: 1 })
], createWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);
router.post("/:id/complete", completeWorkout);

export default router;
