import express from "express";
import { getPrivacyPolicy, savePrivacyPolicy } from "../controller/pravicyPolicyController.js";

const router = express.Router();

router.post("/privacy-policy", savePrivacyPolicy);
router.get("/privacy-policy", getPrivacyPolicy);

export default router;
