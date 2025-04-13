import asyncHandler from "express-async-handler";
import db from "../../config/db.js";
import { UserModel } from "../../models/User.js";
import { sendInterestNotification } from "../../utils/ses.js";

// @desc    Express interest in an opportunity
// @route   POST /api/live-opportunities/:id/interest
// @access  Private
export const expressInterest = asyncHandler(async (req, res) => {
  const opportunityId = req.params.id;
  const userId = req.user.userId;

  try {
    // Get opportunity details
    const opportunity = await db.one(
      `
      SELECT o.*
      FROM live_opportunities o
      WHERE o.id = $1
    `,
      [opportunityId]
    );

    // Get the site creator's details from MongoDB
    const siteCreator = await UserModel.findById(opportunity.user_id);
    if (!siteCreator) {
      throw new Error("Site creator not found");
    }

    // Get interested user's details from MongoDB
    const interestedUser = await UserModel.findById(userId);
    if (!interestedUser) {
      throw new Error("Interested user not found");
    }

    // Record the interest in the database
    await db.none(
      `
      INSERT INTO opportunity_interests (
        opportunity_id,
        user_id,
        created_at
      ) VALUES ($1, $2, NOW())
      ON CONFLICT (opportunity_id, user_id) DO NOTHING
    `,
      [opportunityId, userId]
    );

    // Send email notification with the correct user details
    await sendInterestNotification(
      {
        ...opportunity,
        user_email: siteCreator.email,
        owner: siteCreator,
      },
      {
        name: interestedUser.name,
        email: interestedUser.email,
        organization: interestedUser.businessName || "Not specified",
      }
    );

    res.status(200).json({
      success: true,
      message: "Interest registered successfully",
    });
  } catch (error) {
    console.error("Error expressing interest:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register interest",
    });
  }
});
