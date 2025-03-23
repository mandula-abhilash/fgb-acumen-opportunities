import asyncHandler from "express-async-handler";
import db from "../config/db.js";

// @desc    Create a new assisted site request
// @route   POST /api/assisted-sites
// @access  Private
export const createAssistedSite = asyncHandler(async (req, res) => {
  const {
    siteName,
    siteAddress,
    customSiteAddress,
    opportunityType,
    developerName,
    plots,
    contactEmail,
    contactPhone,
    additionalInfo,
    sitePlanImage,
    coordinates,
    boundary,
  } = req.body;

  // Get the authenticated user's ID from the session
  const userId = req.user.userId;

  if (!userId) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  const site = await db.one(
    `INSERT INTO assisted_sites (
      site_name,
      site_address,
      custom_site_address,
      opportunity_type,
      developer_name,
      plots,
      contact_email,
      contact_phone,
      additional_info,
      site_plan_image,
      user_id,
      coordinates,
      boundary
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
      ST_SetSRID(ST_MakePoint($12, $13), 4326),
      ST_SetSRID(ST_GeomFromGeoJSON($14), 4326)
    ) RETURNING *`,
    [
      siteName,
      siteAddress,
      customSiteAddress,
      opportunityType,
      developerName,
      plots,
      contactEmail,
      contactPhone,
      additionalInfo,
      sitePlanImage,
      userId,
      coordinates?.lng || null,
      coordinates?.lat || null,
      JSON.stringify(boundary),
    ]
  );

  res.status(201).json({
    success: true,
    data: site,
  });
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
