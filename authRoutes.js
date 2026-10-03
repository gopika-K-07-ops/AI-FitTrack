import express from "express";
import { body } from "express-validator";
import { login, me, register } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", [
  body("name").trim().isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 })
], register);

router.post("/login", [
  body("email").isEmail(),
  body("password").notEmpty()
], login);

router.get("/me", protect, me);

export default router;
