import express from "express";
import {
  createAssistedSite,
  getAssistedSites,
  getMyAssistedSites,
  getAssistedSite,
  updateAssistedSiteStatus,
  deleteAssistedSite,
  updatePaymentStatus,
} from "../controllers/assistedSiteController.js";
import visdakSesamModule from "visdak-sesam";

const router = express.Router();
const { middleware } = visdakSesamModule();
const { protect, admin } = middleware;

// Public routes
router.post("/", protect, createAssistedSite);
router.get("/my-sites", protect, getMyAssistedSites);
router.get("/:id", protect, getAssistedSite);
router.delete("/:id", protect, deleteAssistedSite);

// Admin routes
router.get("/", protect, admin, getAssistedSites);
router.patch("/:id/status", protect, admin, updateAssistedSiteStatus);
router.patch("/:id/payment", protect, admin, updatePaymentStatus);

export default router;
