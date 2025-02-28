import express from "express";
import { getPresignedUrl } from "../controllers/uploadController.js";
import visdakSesamModule from "visdak-sesam";

const router = express.Router();
const { middleware } = visdakSesamModule();
const { protect } = middleware;

router.post("/presigned-url", protect, getPresignedUrl);

export default router;
