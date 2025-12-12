import Banner from "../models/Banner.js";

import fs from "fs";
import path from "path";

const deleteOldFile = (fileUrl) => {
  if (!fileUrl) return;

  const filePath = path.join("uploads", fileUrl.replace("/uploads/", ""));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("Deleted old file:", filePath);
  }
};

export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({isActive: true}).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getAllBannersForAdmin = async(req, res) =>{
   try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
}

export const createBanner = async (req, res) => {
  try {
    const { title, isActive, order } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const banner = await Banner.create({
      title,
      imageUrl,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isActive, order } = req.body;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // Text fields
    banner.title = title || banner.title;
    banner.isActive = isActive !== undefined ? isActive : banner.isActive;
    banner.order = order !== undefined ? order : banner.order;

    // File update: delete old file → save new file
    if (req.file) {
      deleteOldFile(banner.imageUrl);
      banner.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedBanner = await banner.save();

    res.status(200).json({ success: true, data: updatedBanner });
  } catch (error) {
    console.error("Update Banner Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // Delete image file from uploads
    deleteOldFile(banner.imageUrl);

    // Delete DB record
    await Banner.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Delete Banner Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

