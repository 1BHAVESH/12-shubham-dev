import express from "express";
import { protect } from "../middleware/auth.js";
import uploadMedia from "../middleware/uploadMediaPost.js";
import { createMedia, deleteMediaPost, getAllMedia, toggleMediaPostStatus, updateMediaPost } from "../controller/mediaPostController.js";

const router = express.Router();

router.get("/get-all-media-posts", getAllMedia);

router.post(
  "/create-post",             
  protect,              
  uploadMedia.single("image"),
  createMedia
);

router.put(
  "/update-post/:id",
  protect,
  uploadMedia.single("image"), // image optional
  updateMediaPost
);

router.delete(
  "/delete-post/:id",
  protect,
  deleteMediaPost
)

router.patch(
  "/toogle-media-staus/:id",
  protect,
  toggleMediaPostStatus
)

export default router;
