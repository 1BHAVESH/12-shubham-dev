import ExcelEnquiry from "../models/ExcelEnquiry.js";


/**
 * 📥 Import Excel Enquiries (Bulk)
 * Excel se aaya hua data yaha store hoga
 */
export const importExcelEnquiries = async (req, res) => {
  try {
    const enquiries = req.body; // array of enquiries

    if (!Array.isArray(enquiries) || enquiries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No enquiry data provided",
      });
    }

    // 🔒 Optional: clear old imported data first
     await ExcelEnquiry.deleteMany();

    const savedData = await ExcelEnquiry.insertMany(enquiries, {
      ordered: false, // ek fail ho to baaki save ho jaaye
    });

    res.status(201).json({
      success: true,
      message: "Excel enquiries imported successfully",
      count: savedData.length,
      data: savedData,
    });
  } catch (error) {
    console.error("Import Excel Enquiry Error:", error);

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
    const enquiries = await ExcelEnquiry.find().sort({ createdAt: -1 });

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
