import multer from "multer";
import path from "path";
import fs from "fs";

// ------------------------------
// CREATE UPLOAD FOLDER IF MISSING
// ------------------------------
const uploadPath = "uploads/mediaPosts";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ------------------------------
// STORAGE CONFIG
// ------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Folder is correct
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;

    // IMPORTANT: Save only relative path in file object
    file.relativePath = `mediaPosts/${uniqueName}`;

    cb(null, uniqueName);
  },
});

// ------------------------------
// FILE TYPE FILTER (ONLY IMAGES)
// ------------------------------
const imageFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// ------------------------------
// MULTER CONFIG
// ------------------------------
const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
