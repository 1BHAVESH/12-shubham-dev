import PrivacyPolicy from "../models/PrivacyPoilcy.js";

export const savePrivacyPolicy = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }

    let policy = await PrivacyPolicy.findOne();

    if (!policy) {
      policy = await PrivacyPolicy.create({ content });
      return res.json({ success: true, message: "Policy created", data: policy });
    }

    policy.content = content;
    await policy.save();

    res.json({ success: true, message: "Policy updated", data: policy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getPrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findOne();

    if (!policy) {
      return res.json({ success: true, data: { content: "" } });
    }

    res.json({ success: true, data: policy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
