import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import mailRoute from "./routes/mailRoute.js";
import adminRoute from "./routes/adminRoute.js";
import bannerRoute from "./routes/bannerRoute.js";
import projectRoute from "./routes/projectRoute.js";
import HomeRoute from "./routes/homeRoute.js"
import CarrerRoute from "./routes/careerRoute.js"
import faqRoute from "./routes/faqRoute.js"
import viewRoute from "./routes/viewRoute.js"
import PrivacyPoilcyRoute from "./routes/PolicyRoute.js";
import genralSettingRoute from "./routes/genralSettingsRoute.js"
import Admin from "./models/Admin.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT;

const app = express();

connectDB();

app.use(cors({
  origin: [process.env.LOCAL_FRONTEND, process.env.WEBSITE_FRONTEND_URL],
  credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/mail", mailRoute);
app.use("/api/admin", adminRoute);
app.use("/api/banners", bannerRoute);
app.use("/api/projects", projectRoute);
app.use("/api/home", HomeRoute)
app.use("/api/career", CarrerRoute)
app.use("/api/faq", faqRoute)
app.use("/api", PrivacyPoilcyRoute)
app.use("/api/view", viewRoute)
app.use("/api/genral-setting", genralSettingRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
