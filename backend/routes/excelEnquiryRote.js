import express from "express";

import { protect } from "../middleware/auth.js";
import { getExcelEnquiries, importExcelEnquiries } from "../controller/excelEqnuiryController.js";

const router = express.Router();

router.post("/create-excel-eqnuiry", protect, importExcelEnquiries)
 router.get("/get-excel-enquiry", protect, getExcelEnquiries);
// router.put("/:id", protect , updateCareer)
// router.delete("/:id", protect , deleteCareer);

export default router;
