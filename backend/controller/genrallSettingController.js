import { GeneralSetting } from "../models/genralSetting.js";

export const getGeneralSetting = async (req, res) => {
  try {
    const settings = await GeneralSetting.findOne();

    return res.status(200).json({
      success: true,
      data: settings || {},   // empty object if no record found
    });
  } catch (error) {
    console.log("GET General Setting Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching settings",
    });
  }
};


export const updateGeneralSetting = async (req, res) => {
  try {
    let settings = await GeneralSetting.findOne();

    // --- FILE UPLOAD HANDLING ---
    const favicon = req.files?.favicon?.[0]?.path;
    const logo = req.files?.logo?.[0]?.path;
    const footerLogo = req.files?.footerLogo?.[0]?.path;

    // --- BUILD UPDATE OBJECT ---
    const updateData = {
      ...req.body,
      ...(favicon && { favicon }),
      ...(logo && { logo }),
      ...(footerLogo && { footerLogo }),
    };

    console.log("Update Data:", updateData);

    if (!settings) {
      // CREATE if no record found
      settings = await GeneralSetting.create(updateData);
    } else {
      // UPDATE EXISTING RECORD
      await GeneralSetting.updateOne({}, { $set: updateData });
      settings = await GeneralSetting.findOne();
    }

    return res.status(200).json({
      success: true,
      message: "General settings updated successfully!",
      data: settings,
    });
  } catch (error) {
    console.log("UPDATE General Setting Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating settings",
    });
  }
};
