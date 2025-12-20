import { Media } from "../models/MediaPost.js";
import fs from "fs";
import path from "path";

export const getAllMedia = async (req, res) => {
  try {
    const { year, month, isActive } = req.query;

    let filter = {};

    // ------------------------------
    // OPTIONAL FILTERS
    // ------------------------------
    if (year) {
      filter.year = Number(year);
    }

    if (month && month !== "All") {
      filter.month = month;
    }

    

    // ------------------------------
    // FETCH MEDIA POSTS
    // ------------------------------
    const mediaPosts = await Media.find(filter).sort({
      publishDate: -1, // latest first
    });

    res.status(200).json({
      success: true,
      count: mediaPosts.length,
      data: mediaPosts,
    });
  } catch (error) {
    console.error("Get all media error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch media posts",
    });
  }
};

export const createMedia = async (req, res) => {
  try {
    const { title, publishDate, year, month, isActive } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const media = await Media.create({
      title,
      publishDate,
      year,
      month,
      image: req.file.relativePath, // ✅ mediaPosts/xxx.jpg
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Media created successfully",
      data: media,
    });
  } catch (error) {
    console.error("Create media error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateMediaPost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body)
    const { title, publishDate, year, month, isActive } = req.body;

    const mediaPost = await Media.findById(id);

    if (!mediaPost) {
      return res
        .status(404)
        .json({ success: false, message: "Media post not found" });
    }

    // ------------------------------
    // 🧹 DELETE OLD IMAGE (if new image uploaded)
    // ------------------------------
    if (req.file && mediaPost.image) {
      const oldImagePath = path.join("uploads", mediaPost.image);

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // save new image path
      mediaPost.image = req.file.relativePath;
    }

    // ------------------------------
    // UPDATE OTHER FIELDS
    // ------------------------------
    if (title !== undefined) mediaPost.title = title;
    if (publishDate !== undefined) mediaPost.publishDate = publishDate;
    if (year !== undefined) mediaPost.year = year;
    if (month !== undefined) mediaPost.month = month;
    if (isActive !== undefined) mediaPost.isActive = isActive;

    await mediaPost.save();

    res.status(200).json({
      success: true,
      message: "Media post updated successfully",
      data: mediaPost,
    });
  } catch (error) {
    console.error("Update media post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update media post",
    });
  }
};

export const deleteMediaPost = async (req, res) => {
  try {
    const { id } = req.params;

    const mediaPost = await Media.findById(id);

    if (!mediaPost) {
      return res.status(404).json({
        success: false,
        message: "Media post not found",
      });
    }

    // -----------------------------
    // DELETE IMAGE FROM UPLOADS
    // -----------------------------
    if (mediaPost.image) {
      const imagePath = path.join(
        process.cwd(),
        "uploads",
        mediaPost.image
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // -----------------------------
    // DELETE MEDIA POST FROM DB
    // -----------------------------
    await mediaPost.deleteOne();

    res.status(200).json({
      success: true,
      message: "Media post deleted successfully",
    });
  } catch (error) {
    console.error("Delete media post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete media post",
    });
  }
};



export const toggleMediaPostStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const mediaPost = await Media.findById(id);

    if (!mediaPost) {
      return res.status(404).json({
        success: false,
        message: "Media post not found",
      });
    }

   

    // -----------------------------
    // TOGGLE STATUS
    // -----------------------------
    mediaPost.isActive = !mediaPost.isActive;
    await mediaPost.save();

    res.status(200).json({
      success: true,
      message: `Media post ${
        mediaPost.isActive ? "activated" : "deactivated"
      } successfully`,
      data: {
        _id: mediaPost._id,
        isActive: mediaPost.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle media post status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update media post status",
    });
  }
};
