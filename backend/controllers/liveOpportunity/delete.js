import asyncHandler from "express-async-handler";
import db from "../../config/db.js";

// @desc    Delete opportunity
// @route   DELETE /api/live-opportunities/:id
// @access  Private
export const deleteLiveOpportunitySite = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";

  // Check if the opportunity exists and if the user has permission to delete it
  const query = isAdmin
    ? "SELECT * FROM live_opportunities WHERE id = $1"
    : "SELECT * FROM live_opportunities WHERE id = $1 AND user_id = $2";

  const params = isAdmin ? [req.params.id] : [req.params.id, req.user.userId];

  const site = await db.oneOrNone(query, params);

  if (!site) {
    res.status(404);
    throw new Error("Opportunity not found or unauthorized");
  }

  // Delete the opportunity
  const deleteQuery = isAdmin
    ? "DELETE FROM live_opportunities WHERE id = $1"
    : "DELETE FROM live_opportunities WHERE id = $1 AND user_id = $2";

  await db.none(deleteQuery, params);

  res.json({
    success: true,
    data: {},
  });
});
