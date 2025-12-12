import express from "express";
import { createCareer, deleteCareer, getJobs, updateCareer } from "../controller/CarrerControlller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getJobs)
router.post("/create-job", protect, createCareer);
router.put("/:id", protect , updateCareer)
router.delete("/:id", protect , deleteCareer);

export default router;
