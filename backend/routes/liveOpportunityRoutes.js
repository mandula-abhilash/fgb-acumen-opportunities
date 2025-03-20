import express from "express";
import {
  createLiveOpportunitySite,
  getLiveOpportunitySites,
  getLiveOpportunitySite,
  updateLiveOpportunitySite,
  deleteLiveOpportunitySite,
  expressInterest,
} from "../controllers/liveOpportunityController.js";
import visdakSesamModule from "visdak-sesam";

const router = express.Router();
const { middleware } = visdakSesamModule();
const { protect, admin } = middleware;

router
  .route("/")
  .post(protect, createLiveOpportunitySite)
  .get(protect, getLiveOpportunitySites);

router
  .route("/:id")
  .get(protect, getLiveOpportunitySite)
  .put(protect, updateLiveOpportunitySite)
  .delete(protect, deleteLiveOpportunitySite);

router.post("/:id/interest", protect, expressInterest);

export default router;
