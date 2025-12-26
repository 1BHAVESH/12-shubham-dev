import mongoose from "mongoose";
import ExcelEnquiry from "../models/ExcelEnquiry.js";
import Project from "../models/Project.js";
import XLSX from "xlsx";
import * as yup from "yup";
import fs from "fs";
import path from "path";


// helper → Excel column letter
const getNameFromNumber = (num) => {
  let str = "";
  while (num > 0) {
    let rem = (num - 1) % 26;
    str = String.fromCharCode(65 + rem) + str;
    num = Math.floor((num - 1) / 26);
  }
  return str;
};


export const importExcelEnquiries = async (req, res) => {
  try {

    console.log(req.body)

    // Debug (remove later)
    console.log("REQ FILE =", req.file);

    if (!req.file || !req.file.path)
      throw new Error("Please upload '.xlsx' file..!!");

    if (
      req.file.mimetype !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      throw new Error("Please upload '.xlsx' file only..!!");
    }


    // ========= READ FILE =========
    const workbook = XLSX.readFile(req.file.path);

    let exportData = [];
    let errorsCount = 0;


    // ========= VALIDATION SCHEMA =========
    const validationSchema = yup.object().shape({
      fullName: yup
        .string()
        .trim()
        .min(2)
        .max(100)
        .required("Full name is required"),

      email: yup
        .string()
        .email("Invalid email")
        .required("Email is required"),

      phone: yup
        .string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone number required"),

      project_id: yup.string().optional(),

      message: yup.string().optional(),
    });



    // ========= LOOP ALL SHEETS =========
    for (let i = 0; i < workbook.SheetNames.length; i++) {

      const rows = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[i]]
      );

      for (let row of rows) {
        try {
          // validate
          await validationSchema.validate(row, { abortEarly: false });

          let projectId = null;
          let projectTitle = null;
console.log("---------------------", row)
          if (row.project_id && mongoose.Types.ObjectId.isValid(row.project_id)) {
            const project = await Project.findById(row.project_id).select("title");
            console.log(project.project)
            if (project) {
              console.log("````````````````", project)
              projectId = project._id;
              projectTitle = project.title;
            }
          }

          exportData.push({
            fullName: row.fullName.trim(),
            email: row.email.toLowerCase().trim(),
            phone: row.phone.trim(),
            message: row.message?.trim() || "Imported from Excel",
            project: projectId,
            _projectTitle: projectTitle,
            error: null,
          });

        } catch (err) {
          errorsCount++;

          exportData.push({
            ...row,
            error: err.inner?.reduce((acc, e) => {
              acc[e.path] = e.message;
              return acc;
            }, {}),
          });
        }
      }
    }



    // ========= CREATE RESULT SHEET =========
    const worksheet = XLSX.utils.json_to_sheet(exportData);


    // ========= WRITE COMMENTS FOR ERROR CELLS =========
    exportData.forEach((row, i) => {

      const { error } = row;

      ["fullName", "email", "phone"].forEach((key, j) => {

        if (error?.[key]) {

          const col = getNameFromNumber(j + 1);
          const cell = `${col}${i + 2}`;

          if (!worksheet[cell]) worksheet[cell] = { t: "s", v: "" };

          worksheet[cell].c = [{ t: `${key}: ${error[key]}`, hidden: true }];
        }
      });
    });



    // ========= FINAL WORKBOOK =========
    const resultWb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(resultWb, worksheet, "Enquiries");


    // ========= FILE PATH =========
    const filePath = `uploads/import-errors/enquiries-${req.file.originalname}`;


    // ⭐ ensure folder exists
    const dir = path.join(process.cwd(), "public/uploads/import-errors");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }


    // ⭐ save file
    XLSX.writeFile(resultWb, "./public/" + filePath);



    // ========= IF ERRORS — RETURN FILE =========
    if (errorsCount > 0) {
      return res.status(422).json({
        success: false,
        message: "Invalid Data Provided",
        download: "http://localhost:3001/" + filePath,
      });
    }



    // ========= SAVE TO DATABASE =========
    await ExcelEnquiry.deleteMany();   // replace old imported data

    await ExcelEnquiry.insertMany(
      exportData.map((e) => {
        const { error, ...d } = e;
        return d;
      })
    );


    return res.json({
      success: true,
      message: "Excel Enquiries Imported Successfully",
    });


  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};




// ==================================
//  GET IMPORTED ENQUIRIES API
// ==================================
export const getExcelEnquiries = async (req, res) => {
  try {
    const enquiries = await ExcelEnquiry.find()
      .populate("project", "title")
      .sort({ createdAt: -1 });

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




// ==================================
//  CLEAR IMPORTED DATA API
// ==================================
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



export const searchEnquiry = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const regex = new RegExp(q, "i");

    const enquiries = await ExcelEnquiry.find({
      $or: [
        { fullName: regex },
        { email: regex },
        { phone: regex },
        { "project.title": regex }
      ]
    }).populate("project");

    if (!enquiries || enquiries.length === 0) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No project found"
      });
    }

    res.status(200).json({
      success: true,
      data: enquiries
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
