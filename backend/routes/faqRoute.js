import express from "express";
import { createFAQ, deleteFAQ, getFAQs, updateFAQ } from "../controller/faqController.js";

const router = express.Router();

router.post("/", createFAQ);
router.get("/", getFAQs);
router.put("/:id", updateFAQ);
router.delete("/:id", deleteFAQ);

export default router;
