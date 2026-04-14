import { Router } from "express";
import { signup, verifyOTP, login, refreshToken, logout } from "../api/auth/index.js";
import { protect } from "../middlewares/index.js";

const router = Router();

router.post("/signup",        signup);
router.post("/verify-otp",    verifyOTP);
router.post("/login",         login);
router.post("/refresh-token", refreshToken);
router.post("/logout",        protect, logout);

export default router;
