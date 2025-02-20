import express from "express";
import {
  createSite,
  getSites,
  getSite,
  updateSite,
  deleteSite,
} from "../controllers/siteController.js";

const router = express.Router();

router.route("/").post(protect, createSite).get(protect, getSites);

router
  .route("/:id")
  .get(protect, getSite)
  .put(protect, updateSite)
  .delete(protect, deleteSite);

export default router;
