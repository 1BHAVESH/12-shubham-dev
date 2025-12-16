import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";              
import { Server } from "socket.io";   

import connectDB from "./config/db.js";
import mailRoute from "./routes/mailRoute.js";
import adminRoute from "./routes/adminRoute.js";
import bannerRoute from "./routes/bannerRoute.js";
import projectRoute from "./routes/projectRoute.js";
import HomeRoute from "./routes/homeRoute.js";
import CarrerRoute from "./routes/careerRoute.js";
import faqRoute from "./routes/faqRoute.js";
import viewRoute from "./routes/viewRoute.js";
import PrivacyPoilcyRoute from "./routes/PolicyRoute.js";
import genralSettingRoute from "./routes/genralSettingsRoute.js";
import videoRoute from "./routes/videoRoute.js";
import jobRoutes from "./routes/jobRoute.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

const app = express();

// 🔹 DB connect
connectDB();

// 🔹 Middleware
app.use(
  cors({
    origin: [
      process.env.LOCAL_FRONTEND,
      process.env.WEBSITE_FRONTEND_URL,
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 🔹 Routes
app.use("/api/mail", mailRoute);
app.use("/api/admin", adminRoute);
app.use("/api/banners", bannerRoute);
app.use("/api/projects", projectRoute);
app.use("/api/home", HomeRoute);
app.use("/api/career", CarrerRoute);
app.use("/api/faq", faqRoute);
app.use("/api", PrivacyPoilcyRoute);
app.use("/api/view", viewRoute);
app.use("/api/genral-setting", genralSettingRoute);
app.use("/api/job-enquiry", jobRoutes);

// ===============================
// 🔥 SOCKET.IO SETUP (IMPORTANT)
// ===============================
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      process.env.LOCAL_FRONTEND,
      process.env.WEBSITE_FRONTEND_URL,
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// ❌ app.listen() HATA DIYA
// ✅ server.listen() USE KARO
server.listen(PORT, () => {
  console.log(`Server running with socket on port ${PORT}`);
});
