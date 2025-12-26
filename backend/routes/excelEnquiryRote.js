import express from "express";
import multer from "multer";

import { protect } from "../middleware/auth.js";
import { 
  getExcelEnquiries, 
  importExcelEnquiries, 
  searchEnquiry
} from "../controller/excelEqnuiryController.js";

const router = express.Router();

// TEMP STORAGE FOLDER
const upload = multer({ dest: "uploads/" });

// IMPORT API
router.post(
  "/create-excel-eqnuiry",
  protect,                          // auth first
  upload.single("excelFile"),       // 👈 THIS IS REQUIRED
  importExcelEnquiries              // controller last
);

// GET API
router.get(
  "/get-excel-enquiry",
  protect,
  getExcelEnquiries
);


router.get("/search", searchEnquiry);

export default router;
