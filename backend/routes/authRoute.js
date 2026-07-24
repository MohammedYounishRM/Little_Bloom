import express from "express";
import {checkAuth, signup, login, logout, verifyEmail, forgotPassword, resetPassword, verifyResetOTP, updateProfile} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.put("/update-profile", verifyToken, updateProfile);

export default router;