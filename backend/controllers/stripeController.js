import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import { UserModel } from "../models/User.js";
import db from "../config/db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const ASSISTED_SITE_PRICE = 25000; // £250.00 in pence

// @desc    Create a checkout session for assisted site submission
// @route   POST /api/checkout/session
// @access  Private
export const createCheckoutSession = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { siteId } = req.body;

  try {
    // Get user details
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Store the form data in the metadata
    const metadata = {
      userId: userId,
      service: "assisted-site-submission",
    };

    // If siteId is provided, store it in metadata
    if (siteId) {
      metadata.siteId = siteId;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Assisted Site Submission",
              description: "Professional preparation of your site listing",
            },
            unit_amount: ASSISTED_SITE_PRICE,
          },
          quantity: 1,
        },
      ],
      metadata: metadata,
      customer_email: user.email,
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({
      status: "success",
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500);
    throw new Error("Failed to create checkout session");
  }
});

// @desc    Verify a checkout session
// @route   GET /api/checkout/verify/:sessionId
// @access  Private
export const verifySession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user.userId;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify that this session belongs to the current user
    if (session.metadata.userId !== userId) {
      res.status(403);
      throw new Error("Unauthorized access to this session");
    }

    // If the session has a siteId, update the site's payment status
    if (session.payment_status === "paid" && session.metadata.siteId) {
      try {
        await db.none(
          `
          UPDATE assisted_sites
          SET 
            is_paid = true,
            payment_session_id = $1,
            status = 'processing',
            updated_at = NOW()
          WHERE id = $2 AND user_id = $3
        `,
          [sessionId, session.metadata.siteId, userId]
        );

        // Get the site details to send notification
        const site = await db.one(
          `
          SELECT * FROM assisted_sites
          WHERE id = $1
        `,
          [session.metadata.siteId]
        );

        // Get user details
        const user = await UserModel.findById(userId);

        // Send notification to admin
        if (site && user) {
          const { sendAdminNotifications } = await import("../utils/email.js");
          await sendAdminNotifications(site, user);
        }
      } catch (dbError) {
        console.error("Error updating site payment status:", dbError);
      }
    }

    res.status(200).json({
      status: session.status,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(500);
    throw new Error("Failed to verify session");
  }
});

// @desc    Handle Stripe webhook events
// @route   POST /api/checkout/webhook
// @access  Public
export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      // Process the successful payment
      if (session.payment_status === "paid") {
        const userId = session.metadata.userId;
        const service = session.metadata.service;
        const siteId = session.metadata.siteId;
        const planId = session.metadata.planId;

        if (service === "assisted-site-submission" && siteId) {
          try {
            // Update the site's payment status
            await db.none(
              `
              UPDATE assisted_sites
              SET 
                is_paid = true,
                payment_session_id = $1,
                status = 'processing',
                updated_at = NOW()
              WHERE id = $2 AND user_id = $3
            `,
              [session.id, siteId, userId]
            );

            console.log(
              `Payment successful for assisted site submission by user ${userId} for site ${siteId} with plan ${planId}`
            );

            // Get the site details to send notification
            const site = await db.one(
              `
              SELECT * FROM assisted_sites
              WHERE id = $1
            `,
              [siteId]
            );

            // Get user details
            const user = await UserModel.findById(userId);

            // Send notification to admin
            if (site && user) {
              const { sendAdminNotifications } = await import(
                "../utils/email.js"
              );
              await sendAdminNotifications(site, user);
            }
          } catch (error) {
            console.error("Error updating site payment status:", error);
          }
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send({ received: true });
});
