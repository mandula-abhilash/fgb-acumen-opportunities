import express from "express";
import * as liveOpportunityController from "../controllers/liveOpportunity/index.js";
import visdakSesamModule from "visdak-sesam";

const router = express.Router();
const { middleware } = visdakSesamModule();
const { protect, admin } = middleware;

router
  .route("/")
  .post(protect, liveOpportunityController.createLiveOpportunitySite)
  .get(protect, liveOpportunityController.getLiveOpportunitySites);

router
  .route("/:id")
  .get(protect, liveOpportunityController.getLiveOpportunitySite)
  .put(protect, liveOpportunityController.updateLiveOpportunitySite)
  .delete(protect, liveOpportunityController.deleteLiveOpportunitySite);

router.post(
  "/:id/interest",
  protect,
  liveOpportunityController.expressInterest
);

router.patch(
  "/:id/publish",
  protect,
  admin,
  liveOpportunityController.publishSite
);

export default router;
