import express from "express";
import {
  addToShortlist,
  removeFromShortlist,
  getShortlistedOpportunities,
  checkShortlistStatus,
} from "../controllers/shortlistController.js";
import visdakSesamModule from "visdak-sesam";

const router = express.Router();
const { middleware } = visdakSesamModule();
const { protect } = middleware;

router
  .route("/")
  .get(protect, getShortlistedOpportunities)
  .post(protect, addToShortlist);

router
  .route("/:id")
  .get(protect, checkShortlistStatus)
  .delete(protect, removeFromShortlist);

export default router;
