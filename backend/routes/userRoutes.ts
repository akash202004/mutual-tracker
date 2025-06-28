import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userController";
import { auth } from "../middlewares/auth";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", auth, getUserProfile);

export default router;
