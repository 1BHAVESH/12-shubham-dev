import express from "express";
import { contactSubmit } from "../controller/mailSend.js";

const router = express.Router();

router.post("/send-email", contactSubmit);

export default router;
