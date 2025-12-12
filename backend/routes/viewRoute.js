import express from "express";
import { increaseProjectView, increaseWebsiteView } from "../controller/viewController.js";

const router = express.Router();

// 🔹 Website view counter
router.get("/website", increaseWebsiteView);

// 🔹 Project view counter
router.post("/project", increaseProjectView);

// // 🔹 Get all views (optional for admin dashboard)
// router.get("/all", getAllViews);

export default router;
