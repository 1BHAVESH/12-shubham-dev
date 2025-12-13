import express from "express";
import { getProjectVideo, streamVideo } from "../controller/videoController.js";


const router = express.Router();

router.get("/video/:name", streamVideo);
router.get("/project-video/:id", getProjectVideo);


export default router;
