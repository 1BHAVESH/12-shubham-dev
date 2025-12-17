import express from "express";
import { login, register, getProfile, updateProfile, changePassword, logout } from "../controller/adminController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", changePassword);

export default router;
