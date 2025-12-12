import FAQ from "../models/Faq.js";


// CREATE FAQ
export const createFAQ = async (req, res) => {
  try {
    const { question, answer, order } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        status: false,
        message: "Question and Answer are required",
      });
    }

    const faq = await FAQ.create({ question, answer, order });

    return res.status(201).json({
      status: true,
      message: "FAQ created successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Create FAQ Error:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// GET ALL FAQs
export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      status: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Get FAQ Error:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// UPDATE FAQ
export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id)
    console.log(req.body)
    const { question, answer, order } = req.body;

    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({
        status: false,
        message: "FAQ not found",
      });
    }

    faq.question = question;
    faq.answer = answer;
    faq.order = order;

    await faq.save();

    return res.status(200).json({
      status: true,
      message: "FAQ updated successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Update FAQ Error:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// DELETE FAQ
export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return res.status(404).json({
        status: false,
        message: "FAQ not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error("Delete FAQ Error:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
