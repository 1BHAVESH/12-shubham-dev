import mongoose from "mongoose";
import ExcelEnquiry from "../models/ExcelEnquiry.js";
import Project from "../models/Project.js";
import { io } from "../server.js";


/**
 * 📥 Import Excel Enquiries (Bulk)
 * Excel se aaya hua data yaha store hoga
 */
export const importExcelEnquiries = async (req, res) => {
  try {
    const enquiries = req.body;

    if (!Array.isArray(enquiries) || enquiries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No enquiry data provided",
      });
    }

    // 🔥 STEP 1: DELETE OLD EXCEL ENQUIRIES
    await ExcelEnquiry.deleteMany({});
    console.log("🗑️ Old Excel enquiries deleted");

    const formattedEnquiries = [];

    for (const e of enquiries) {
      if (!e.fullName || !e.email || !e.phone) continue;

      let projectId = null;
      let projectTitle = null;

      if (e.Project_Id && mongoose.Types.ObjectId.isValid(e.Project_Id)) {
        const projectDoc = await Project.findById(e.Project_Id).select("title");
        if (projectDoc) {
          projectId = projectDoc._id;
          projectTitle = projectDoc.title;
        }
      }

      formattedEnquiries.push({
        fullName: e.fullName.trim(),
        email: e.email.toLowerCase().trim(),
        phone: e.phone,
        message: e.message?.trim() || "Imported from Excel",
        project: projectId,
        _projectTitle: projectTitle,
      });
    }

    if (formattedEnquiries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid enquiries found",
      });
    }

    // 🔥 STEP 2: INSERT FRESH DATA (NO UPSERT)
    const insertedDocs = await ExcelEnquiry.insertMany(formattedEnquiries);

    // 🔥 SOCKET EVENT (OPTIONAL)
    insertedDocs.forEach((e) => {
      io.emit("newEnquiry", {
        fullName: e.fullName,
        email: e.email,
        phone: e.phone,
        message: e.message,
        project: e.project
          ? { _id: e.project, title: e._projectTitle }
          : null,
      });
    });

    res.status(201).json({
      success: true,
      message: "Excel enquiries imported successfully (old data replaced)",
      inserted: insertedDocs.length,
    });
  } catch (error) {
    console.error("❌ Import Excel Enquiry Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import excel enquiries",
    });
  }
};


/**
 * 📄 Get All Excel Enquiries
 * UI me imported data show karne ke liye
 */
export const getExcelEnquiries = async (req, res) => {
  try {
    const enquiries = await ExcelEnquiry.find()
      .populate("project", "title") // 🔥 IMPORTANT
      .sort({ createdAt: -1 });

    console.log("📤 Excel Enquiries:", enquiries);

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Get Excel Enquiry Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch excel enquiries",
    });
  }
};
/**
 * ❌ Clear All Excel Enquiries
 * Jab admin "Imported ❌" par click kare
 */
export const clearExcelEnquiries = async (req, res) => {
  try {
    await ExcelEnquiry.deleteMany();

    res.status(200).json({
      success: true,
      message: "All excel enquiries cleared",
    });
  } catch (error) {
    console.error("Clear Excel Enquiry Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear excel enquiries",
    });
  }
};