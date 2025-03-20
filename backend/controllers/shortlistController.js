import asyncHandler from "express-async-handler";
import db from "../config/db.js";

// @desc    Add opportunity to user's shortlist
// @route   POST /api/shortlists
// @access  Private
export const addToShortlist = asyncHandler(async (req, res) => {
  const { opportunityId } = req.body;
  const userId = req.user.userId;

  try {
    // Check if opportunity exists
    const opportunity = await db.oneOrNone(
      "SELECT id FROM live_opportunities WHERE id = $1",
      [opportunityId]
    );

    if (!opportunity) {
      res.status(404);
      throw new Error("Opportunity not found");
    }

    // Add to shortlist
    await db.none(
      `
      INSERT INTO shortlists (user_id, opportunity_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, opportunity_id) DO NOTHING
    `,
      [userId, opportunityId]
    );

    res.status(201).json({
      success: true,
      message: "Added to shortlist",
    });
  } catch (error) {
    if (error.constraint === "shortlists_opportunity_id_fkey") {
      res.status(404);
      throw new Error("Opportunity not found");
    }
    throw error;
  }
});

// @desc    Remove opportunity from user's shortlist
// @route   DELETE /api/shortlists/:id
// @access  Private
export const removeFromShortlist = asyncHandler(async (req, res) => {
  const opportunityId = req.params.id;
  const userId = req.user.userId;

  const result = await db.result(
    `
    DELETE FROM shortlists
    WHERE user_id = $1 AND opportunity_id = $2
  `,
    [userId, opportunityId]
  );

  if (result.rowCount === 0) {
    res.status(404);
    throw new Error("Shortlist entry not found");
  }

  res.json({
    success: true,
    message: "Removed from shortlist",
  });
});

// @desc    Get user's shortlisted opportunities
// @route   GET /api/shortlists
// @access  Private
export const getShortlistedOpportunities = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const opportunities = await db.any(
    `
    SELECT 
      o.*,
      ST_X(o.geom) as longitude,
      ST_Y(o.geom) as latitude,
      ARRAY_AGG(DISTINCT l.lpa22nm) as lpa_names,
      ARRAY_AGG(DISTINCT r.name) as region_names
    FROM shortlists s
    JOIN live_opportunities o ON s.opportunity_id = o.id
    LEFT JOIN local_planning_authorities l ON l.lpa22cd = ANY(o.lpa)
    LEFT JOIN custom_regions r ON r.id::uuid = ANY(o.region::uuid[])
    WHERE s.user_id = $1
    GROUP BY o.id
    ORDER BY s.created_at DESC
  `,
    [userId]
  );

  res.json({
    success: true,
    data: opportunities,
  });
});

// @desc    Check if opportunity is shortlisted
// @route   GET /api/shortlists/:id
// @access  Private
export const checkShortlistStatus = asyncHandler(async (req, res) => {
  const opportunityId = req.params.id;
  const userId = req.user.userId;

  const shortlist = await db.oneOrNone(
    `
    SELECT id FROM shortlists
    WHERE user_id = $1 AND opportunity_id = $2
  `,
    [userId, opportunityId]
  );

  res.json({
    success: true,
    isShortlisted: !!shortlist,
  });
});
