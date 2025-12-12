import express from "express";
import { getGeneralSetting, updateGeneralSetting } from "../controller/genrallSettingController.js";
import upload from "../middleware/uploadFiles.js";

const router = express.Router();

router.get("/general-settings", getGeneralSetting);

router.put(
  "/general-settings",
  upload.fields([
    { name: "favicon", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "footerLogo", maxCount: 1 }
  ]),
  updateGeneralSetting
);

export default router;
