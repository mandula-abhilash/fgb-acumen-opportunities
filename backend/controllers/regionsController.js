import asyncHandler from "express-async-handler";
import db from "../config/db.js";

// @desc    Get all regions
// @route   GET /api/regions
// @access  Public
export const getRegions = asyncHandler(async (req, res) => {
  const regions = await db.any(
    "SELECT name as label, objectid as value FROM region ORDER BY name ASC"
  );

  res.json({
    success: true,
    data: regions,
  });
});
