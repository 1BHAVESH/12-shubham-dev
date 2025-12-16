import { JobApplication } from "../models/jobApplyModel.js";
import fs from "fs";
import path from "path";
export const applyForJob = async (req, res) => {
  try {
    const { jobTitle, fullName, email, phone } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Resume is required" });
    }

    if (!jobTitle || !fullName || !email || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const application = await JobApplication.create({
      jobTitle,
      fullName,
      email,
      phone,
      resume: req.file.path,
    });

    res.status(201).json({
      success: true,
      message: "Job applied successfully",
      data: application,
    });
  } catch (error) {
    console.error("Apply job error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ==============================
// GET ALL APPLICATIONS (ADMIN)
// ==============================
export const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// UPDATE APPLICATION STATUS
// ==============================
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    res.status(200).json({
      success: true,
      message: "Status updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// DELETE APPLICATION
// ==============================
export const deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // 👉 Delete resume file
    if (application.resume) {
      const filePath = path.resolve(application.resume);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 👉 Delete DB record
    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application & resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteAllApplications = async (req, res) => {
  try {

    const applications = await JobApplication.find();

    if(!applications){
      return res
      .status(404)
      .json({ success: false, message: "No applications found" });
    }

    await JobApplication.deleteMany();

    res.status(200).json({
      success: true,
      message: "All applications deleted successfully",
    });
    
  } catch (error) {
    console.error("Delete all applications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    
  }
}