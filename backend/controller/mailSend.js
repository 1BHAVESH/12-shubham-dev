import nodemailer from "nodemailer";
import Contact from "../models/Enquiry.js";
import { io } from "../server.js";


export const contactSubmit = async (req, res) => {
  const { fullName, email, phone, message, project } = req.body;

  try {
    // ---------------- SAVE IN DATABASE ---------------- //
    const newContact = await Contact.create({
      fullName,
      email,
      phone,
      message,
      project: project || "",
    });

    // 🔥 SOCKET EVENT
    io.emit("newEnquiry", newContact);

    // ---------------- SEND EMAIL (OPTIONAL) ---------------- //
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST_NAME,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      let htmlTemplate = project
        ? `<p>Project Enquiry from ${fullName}</p>`
        : `<p>General Enquiry from ${fullName}</p>`;

      await transporter.sendMail({
        from: `"${fullName}" <${email}>`,
        to: "1bhaveshjaswani1@gmail.com",
        subject: project
          ? `Enquiry - ${project}`
          : "General Enquiry",
        html: htmlTemplate,
      });

      console.log("📧 Email sent successfully");

    } catch (mailError) {
      // ❌ MAIL FAILED BUT API SHOULD NOT FAIL
      console.error("📧 Email failed (credits issue):", mailError.message);
    }

    // ✅ ALWAYS SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      message:
        "Your enquiry has been submitted successfully. Our team will contact you soon.",
      data: newContact,
    });

  } catch (error) {
    console.error("Contact Submit Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
};


export const deleteEnquiry = async (req, res) => {
  try {

    const { id } = req.params;

    const deleteEnquiry = await Contact.findByIdAndDelete(id)

    if(!deleteEnquiry){
      return res.status(404).json({
        message: "Enquiry not found",
        success: false
      })
    }

    return res.status(200).json({
      message: "Enquiry deleted successfully",
      success: true
    })
    
  } catch (error) {

    return res.status(500).json({
      message: error.message || "Unable to delete enquiry",
      success: false
    });

    console.log("Deleted Enquiry Error:", error);     
    
  }
}