import { View } from "../models/view.js";

export const getAllViews = async (req, res) => {
  try {
    const views = await View.find();

    // 👉 Sirf ips length
    const ipsLength = views.reduce((total, item) => {
      return total + (item.ips?.length || 0);
    }, 0);

    console.log(ipsLength)

    res.status(200).json({
      success: true,
      uniqueVisitors: ipsLength, // ⭐ only this
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const increaseWebsiteView = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    console.log("Visitor  Ip:", ip);

    // // ❌ ignore localhost
    // if (ip === "::1" || ip === "127.0.0.1") {
    //   return res.json({ success: false });
    // }

    // 📅 today's date (simple & clean)
    const today = new Date().toISOString().split("T")[0];

    let viewDoc = await View.findOne();

    if (!viewDoc) {
      await View.create({
        websiteCount: 1,
        ips: [{ ip, date: today }],
      });

      return res.json({ success: true, message: "First view counted" });
    }

    // 🔍 check same IP + same date
    const alreadyViewedToday = viewDoc.ips.find(
      (item) => item.ip === ip && item.date === today
    );

    if (alreadyViewedToday) {
      return res.json({
        success: true,
        message: "Already counted today",
      });
    }

    // ✅ New day OR new IP
    viewDoc.websiteCount += 1;
    viewDoc.ips.push({ ip, date: today });

    await viewDoc.save();

    res.json({
      success: true,
      count: viewDoc.websiteCount,
    });
  } catch (error) {
    console.error("View error:", error);
    res.status(500).json({ success: false });
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
