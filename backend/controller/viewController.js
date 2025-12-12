import { View } from "../models/view.js";

export const increaseWebsiteView = async (req, res) => {
  try {
    let views = await View.findOne();

    if (!views) {
      views = await View.create({ websiteCount: 1 });
    } else {
      views.websiteCount += 1;
      await views.save();
    }

    res.status(200).json({ success: true, count: views.websiteCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const increaseProjectView = async (req, res) => {
  try {
    const { projectId, title } = req.body;

    let views = await View.findOne();

    if (!views) {
      views = await View.create({
        websiteCount: 0,
        projectViews: [{ projectId, title, count: 1 }],
      });
      return res.status(200).json({ success: true });
    }

    // Check if entry already exists
    const existing = views.projectViews.find(
      (p) => p.projectId.toString() === projectId
    );

    if (existing) {
      existing.count += 1;
    } else {
      views.projectViews.push({ projectId, title, count: 1 });
    }

    await views.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
