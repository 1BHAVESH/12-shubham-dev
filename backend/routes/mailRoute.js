import express from "express";
import { contactSubmit, deleteEnquiry, getAllContacts } from "../controller/mailSend.js";

const router = express.Router();

router.post("/send-email", contactSubmit);
router.get("/", getAllContacts)
router.delete("/:id", deleteEnquiry)

export default router;
