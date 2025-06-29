import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getCurrentUserId,
} from "../controllers/userController";
import { auth } from "../middlewares/auth";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", auth, getUserProfile);
router.get("/current-user-id", auth, getCurrentUserId);

export default router;
