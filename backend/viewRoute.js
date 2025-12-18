import express from "express";
import { getAllViews, increaseProjectView, increaseWebsiteView } from "../controller/viewController.js";

const router = express.Router();

// 🔹 Website view counter
router.get("/website", increaseWebsiteView);

// 🔹 Project view counter
router.post("/project", increaseProjectView);

// // 🔹 Get all views (optional for admin dashboard)
 router.get("/get-view-count", getAllViews);

export default router;
