import nodemailer from "nodemailer";
import Contact from "../models/Enquiry.js";


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
 
    // ---------------- SEND EMAIL ---------------- //
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let htmlTemplate = "";

    // CASE 1: Project Selected
    if (project) {
      htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background:#f7f7f7;">
        <div style="max-width: 600px; margin: auto; background:#ffffff; padding: 20px; border-radius: 10px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

          <h2 style="color:#C29A2D; margin-bottom: 15px;">📩 New Project Enquiry</h2>

          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Project:</strong> ${project}</p>

          <div style="margin-top: 15px; padding:15px; background:#fafafa; border-left: 4px solid #C29A2D;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-line;">${message}</p>
          </div>

        </div>
      </div>`;
    }

    // CASE 2: No Project (General Enquiry)
    else {
      htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background:#f7f7f7;">
        <div style="max-width: 600px; margin: auto; background:#ffffff; padding: 20px; border-radius: 10px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

          <h2 style="color:#C29A2D; margin-bottom: 15px;">📩 New General Enquiry</h2>

          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>

          <div style="margin-top: 15px; padding:15px; background:#fafafa; border-left: 4px solid #C29A2D;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-line;">${message}</p>
          </div>

        </div>
      </div>`;
    }

    await transporter.sendMail({
      from: `"${fullName}" <${email}>`,
      to: "1bhaveshjaswani1@gmail.com",
      subject: project ? `Enquiry - ${project}` : "General Enquiry",
      html: htmlTemplate,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
      data: newContact,
    });

  } catch (error) {
    console.log("Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing request",
      error,
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
