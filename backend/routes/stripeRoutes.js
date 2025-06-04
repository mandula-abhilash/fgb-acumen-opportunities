import express from "express";
import {
  createCheckoutSession,
  handleStripeWebhook,
  verifySession,
} from "../controllers/stripeController.js";
import visdakSesamModule from "visdak-sesam";

const router = express.Router();
const { middleware } = visdakSesamModule();
const { protect } = middleware;

// Create checkout session
router.post("/session", protect, createCheckoutSession);

// Verify session
router.get("/verify/:sessionId", protect, verifySession);

// Webhook handler (no auth required)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
