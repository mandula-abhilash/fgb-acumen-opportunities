import asyncHandler from "express-async-handler";
import db from "../config/db.js";
import { UserModel } from "../models/User.js";
import { sendAdminNotifications } from "../utils/email.js";

// @desc    Create a new assisted site request
// @route   POST /api/assisted-sites
// @access  Private
export const createAssistedSite = asyncHandler(async (req, res) => {
  const {
    siteName,
    siteAddress,
    customSiteAddress,
    opportunityType,
    plots,
    contactEmail,
    contactPhone,
    additionalInfo,
    sitePlanImage,
    sitePlanDocument,
    coordinates,
    boundary,
    queriesContactName,
    initialEOIDate,
    bidSubmissionDate,
    manageBidsProcess,
  } = req.body;

  // Get the authenticated user's ID from the session
  const userId = req.user.userId;

  if (!userId) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  // Get user details for email notification
  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Validate and format boundary data
  let boundaryGeometry = null;
  if (boundary && typeof boundary === "object") {
    try {
      // Ensure the boundary is a valid GeoJSON Polygon
      if (
        boundary.type !== "Polygon" ||
        !Array.isArray(boundary.coordinates) ||
        !Array.isArray(boundary.coordinates[0]) ||
        boundary.coordinates[0].length < 4 || // Minimum 4 points for a closed polygon
        !boundary.coordinates[0].every(
          (coord) =>
            Array.isArray(coord) &&
            coord.length === 2 &&
            typeof coord[0] === "number" &&
            typeof coord[1] === "number"
        )
      ) {
        res.status(400);
        throw new Error("Invalid boundary data format");
      }

      // Ensure the polygon is closed (first and last points match)
      const firstPoint = boundary.coordinates[0][0];
      const lastPoint =
        boundary.coordinates[0][boundary.coordinates[0].length - 1];
      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        boundary.coordinates[0].push([...firstPoint]); // Close the polygon
      }

      boundaryGeometry = JSON.stringify(boundary);
    } catch (error) {
      console.error("Error processing boundary data:", error);
      res.status(400);
      throw new Error("Invalid boundary data: " + error.message);
    }
  }

  // Format dates to ensure they are treated as UTC midnight
  const formatDate = (dateString) => {
    if (!dateString) return null;
    // Create a new Date object from the input string and format it as YYYY-MM-DD
    return new Date(dateString).toISOString().split("T")[0];
  };

  try {
    const site = await db.one(
      `INSERT INTO assisted_sites (
        site_name,
        site_address,
        custom_site_address,
        opportunity_type,
        plots,
        contact_email,
        contact_phone,
        additional_info,
        site_plan_image,
        site_plan_document,
        user_id,
        coordinates,
        boundary,
        queries_contact_name,
        initial_eoi_date,
        bid_submission_date,
        manage_bids_process
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        ST_SetSRID(ST_MakePoint($12, $13), 4326),
        CASE 
          WHEN $14::jsonb IS NOT NULL 
          THEN ST_SetSRID(ST_GeomFromGeoJSON($14), 4326)
          ELSE NULL
        END,
        $15, $16, $17, $18
      ) RETURNING *`,
      [
        siteName,
        siteAddress,
        customSiteAddress,
        opportunityType,
        plots,
        contactEmail,
        contactPhone,
        additionalInfo,
        sitePlanImage,
        sitePlanDocument,
        userId,
        coordinates?.lng || null,
        coordinates?.lat || null,
        boundaryGeometry,
        queriesContactName,
        formatDate(initialEOIDate),
        formatDate(bidSubmissionDate),
        manageBidsProcess || false,
      ]
    );

    // Send notifications to admin users
    try {
      await sendAdminNotifications(site, user);
    } catch (error) {
      console.error("Failed to send admin notifications:", error);
      // Don't fail the request if notifications fail
    }

    res.status(201).json({
      success: true,
      data: site,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500);
    throw new Error("Failed to create assisted site: " + error.message);
  }
});

// @desc    Get all assisted sites (admin only)
// @route   GET /api/assisted-sites
// @access  Private/Admin
export const getAssistedSites = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let query = `
    SELECT 
      a.*,
      ST_X(a.coordinates) as longitude,
      ST_Y(a.coordinates) as latitude,
      ST_AsGeoJSON(a.boundary)::json as boundary
    FROM assisted_sites a
  `;

  const params = [];
  if (status) {
    query += ` WHERE a.status = $1`;
    params.push(status);
  }

  query += ` ORDER BY a.created_at DESC`;

  const sites = await db.any(query, params);

  res.json({
    success: true,
    data: sites,
  });
});

// @desc    Get user's assisted sites
// @route   GET /api/assisted-sites/my-sites
// @access  Private
export const getMyAssistedSites = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const sites = await db.any(
    `
    SELECT 
      a.*,
      ST_X(a.coordinates) as longitude,
      ST_Y(a.coordinates) as latitude,
      ST_AsGeoJSON(a.boundary)::json as boundary
    FROM assisted_sites a
    WHERE a.user_id = $1
    ORDER BY a.created_at DESC
  `,
    [userId]
  );

  res.json({
    success: true,
    data: sites,
  });
});

// @desc    Get single assisted site
// @route   GET /api/assisted-sites/:id
// @access  Private
export const getAssistedSite = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const userId = req.user.userId;

  const query = `
    SELECT 
      a.*,
      ST_X(a.coordinates) as longitude,
      ST_Y(a.coordinates) as latitude,
      ST_AsGeoJSON(a.boundary)::json as boundary
    FROM assisted_sites a
    WHERE a.id = $1 ${isAdmin ? "" : "AND a.user_id = $2"}
  `;

  const params = isAdmin ? [req.params.id] : [req.params.id, userId];

  const site = await db.oneOrNone(query, params);

  if (!site) {
    res.status(404);
    throw new Error("Assisted site not found or unauthorized");
  }

  res.json({
    success: true,
    data: site,
  });
});

// @desc    Update assisted site status (admin only)
// @route   PATCH /api/assisted-sites/:id/status
// @access  Private/Admin
export const updateAssistedSiteStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["pending", "processing", "published", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const site = await db.oneOrNone(
    `
    UPDATE assisted_sites
    SET 
      status = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `,
    [status, req.params.id]
  );

  if (!site) {
    res.status(404);
    throw new Error("Assisted site not found");
  }

  res.json({
    success: true,
    data: site,
  });
});

// @desc    Delete assisted site
// @route   DELETE /api/assisted-sites/:id
// @access  Private
export const deleteAssistedSite = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const userId = req.user.userId;

  const query = isAdmin
    ? "DELETE FROM assisted_sites WHERE id = $1"
    : "DELETE FROM assisted_sites WHERE id = $1 AND user_id = $2 AND status = 'pending'";

  const params = isAdmin ? [req.params.id] : [req.params.id, userId];

  const result = await db.result(query, params);

  if (result.rowCount === 0) {
    res.status(404);
    throw new Error("Assisted site not found or cannot be deleted");
  }

  res.json({
    success: true,
    message: "Assisted site deleted successfully",
  });
});
