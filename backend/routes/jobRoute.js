import express from "express";
import { applyForJob, deleteAllApplications, deleteApplication, getAllApplications, updateApplicationStatus } from "../controller/jobController.js";
import { uploadResume } from "../middleware/resumeUpload.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ================================
   APPLY FOR JOB (PUBLIC)
================================ */
router.post(
  "/apply",
  uploadResume.single("resume"),
  applyForJob
);

/* ================================
   GET ALL APPLICATIONS (ADMIN)
================================ */
router.get(
  "/applications",
  getAllApplications
);

/* ================================
   UPDATE APPLICATION STATUS
================================ */
router.put(
  "/applications/:id",
  updateApplicationStatus
);

/* ================================
   DELETE APPLICATION (DB + FILE)
================================ */

router.delete("/delete-all-applications/", protect, deleteAllApplications)

router.delete(
  "/applications/:id",
  deleteApplication
);


export default router;
