import express from "express";
import { getRegions } from "../controllers/regionsController.js";

const router = express.Router();

router.route("/").get(getRegions);

export default router;
