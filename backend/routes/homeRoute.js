import express from "express";
import { 
  getHomePage, 
  addTestimonial, 
  deleteTestimonial, 
  createOrUpdateHomePage 
} from "../controller/HomePageController.js";

import multer from "multer";
import path from "path";

// -------------------- MULTER SETUP --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // local folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

const router = express.Router();

// -------------------- ROUTES --------------------

router.get("/homepage", getHomePage);

// ⭐ About + Testimonials images upload handled here
router.post(
  "/homepage",
  upload.fields([
    { name: "aboutImage", maxCount: 1 },
    { name: "testimonialPhotos", maxCount: 20 }
  ]),
  createOrUpdateHomePage
);

// If adding testimonial separately → single image upload allowed
router.post(
  "/homepage/testimonial",
  upload.single("photo"),
  addTestimonial
);

router.delete("/homepage/testimonial/:id", deleteTestimonial);

export default router;
