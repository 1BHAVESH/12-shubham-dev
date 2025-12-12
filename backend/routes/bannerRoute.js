import express from "express";
import multer from "multer";
import path from "path";
import { getAllBanners, createBanner, updateBanner, deleteBanner, getAllBannersForAdmin } from "../controller/bannerController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `banner-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|jfif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

router.get("/", getAllBanners);
router.get("/banner", protect, getAllBannersForAdmin)
router.post("/", protect, upload.single("image"), createBanner);
router.put("/:id", protect, upload.single("image"), updateBanner);
router.delete("/:id", protect, deleteBanner);

export default router;
