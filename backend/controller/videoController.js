import fs from "fs";
import path from "path";
import Project from "../models/Project.js";

export const streamVideo = (req, res) => {
  const videoName = req.params.name;
  const videoPath = path.join(process.cwd(), "uploads", videoName);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // 👇 chunk logic
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    file.pipe(res);
  } else {
    // fallback
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(videoPath).pipe(res);
  }
};


export const getProjectVideo = async (req, res) => {
  const project = await Project.findById(req.params.id).select("videoUrl");

  if (!project || !project.video) {
    return res.status(404).json({ success: false });
  }

  res.json({
    success: true,
    videoUrl: `/api/video/${project.video}`, // 👈 streaming URL
  });
};
