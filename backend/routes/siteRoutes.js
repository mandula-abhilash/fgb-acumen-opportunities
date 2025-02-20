import express from "express";
import {
  createSite,
  getSites,
  getSite,
  updateSite,
  deleteSite,
} from "../controllers/siteController.js";
import visdakSesamModule from "visdak-sesam";

const router = express.Router();
const { middleware } = visdakSesamModule();
const { protect, admin } = middleware;

router.route("/").post(protect, createSite).get(protect, getSites);

router
  .route("/:id")
  .get(protect, getSite)
  .put(protect, updateSite)
  .delete(protect, deleteSite);

export default router;
