import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectTtile,
  toggleProjectStatus,
} from "../controller/projectController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const prefix = file.fieldname;
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const imageFields = [
  "image", 
  "logo", 
  "overviewImage", 
  "masterPlanImage", 
  "floorPlanImage", 
  "buildingImage", 
  "galleryImages",
  "amenityIcons"  // Added amenity icons
];
const videoFields = ["video"];
const pdfFields = ["brochure", "priceSheet"];

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (imageFields.includes(file.fieldname)) {
      const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      }
      cb(new Error(`Only image files are allowed for ${file.fieldname}!`));
    } else if (videoFields.includes(file.fieldname)) {
      const allowedTypes = /mp4|webm|mov|avi/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      if (extname) {
        return cb(null, true);
      }
      cb(new Error("Only video files are allowed for video field!"));
    } else if (pdfFields.includes(file.fieldname)) {
      const allowedTypes = /pdf/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      if (extname) {
        return cb(null, true);
      }
      cb(new Error(`Only PDF files are allowed for ${file.fieldname}!`));
    } else {
      cb(new Error("Unexpected field"));
    }
  },
});

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "logo", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "overviewImage", maxCount: 1 },
  { name: "masterPlanImage", maxCount: 1 },
  { name: "floorPlanImage", maxCount: 1 },
  { name: "buildingImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 20 },
  { name: "amenityIcons", maxCount: 50 },  // Added amenity icons field
  { name: "brochure", maxCount: 1 },
  { name: "priceSheet", maxCount: 1 },
]);

router.get("/", getAllProjects);
router.get("/get-title", getProjectTtile)
router.get("/slug/:slug", getProjectBySlug);
router.get("/:id", getProjectById);
router.patch("/toggle/:id", protect, toggleProjectStatus);
router.post("/", protect, uploadFields, createProject);
router.put("/:id", protect, uploadFields, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;