import express from "express";
import { contactSubmit, getAllContacts } from "../controller/mailSend.js";

const router = express.Router();

router.post("/send-email", contactSubmit);
router.get("/", getAllContacts)

export default router;
