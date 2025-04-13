import asyncHandler from "express-async-handler";
import db from "../../config/db.js";

// @desc    Publish a site
// @route   PUT /api/live-opportunities/:id/publish
// @access  Private/Admin
export const publishSite = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Only admin users can publish sites
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to publish sites");
  }

  const site = await db.oneOrNone(
    `
    UPDATE live_opportunities
    SET 
      status = 'published',
      site_added_to_portal_date = CURRENT_DATE,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `,
    [id]
  );

  if (!site) {
    res.status(404);
    throw new Error("Site not found");
  }

  res.json({
    success: true,
    data: site,
  });
});
