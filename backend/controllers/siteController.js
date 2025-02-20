import asyncHandler from "express-async-handler";
import db from "../config/db.js";

// @desc    Create a new site
// @route   POST /api/sites
// @access  Private
export const createSite = asyncHandler(async (req, res) => {
  const {
    siteName,
    siteAddress,
    opportunityType,
    developerName,
    developerRegion,
    googleMapsLink,
    lpa,
    region,
    planningStatus,
    landPurchaseStatus,
    plots,
    tenures,
    startOnSiteDate,
    handoverDate,
  } = req.body;

  const site = await db.one(
    `INSERT INTO sites (
      site_name, site_address, opportunity_type, developer_name, developer_region,
      google_maps_link, lpa, region, planning_status, land_purchase_status,
      plots, tenures, start_on_site_date, handover_date, user_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
    ) RETURNING *`,
    [
      siteName,
      siteAddress,
      opportunityType,
      developerName,
      developerRegion,
      googleMapsLink,
      lpa,
      region,
      planningStatus,
      landPurchaseStatus,
      plots,
      tenures,
      startOnSiteDate,
      handoverDate,
      req.user.id,
    ]
  );

  res.status(201).json({
    success: true,
    data: site,
  });
});

// @desc    Get all sites
// @route   GET /api/sites
// @access  Private
export const getSites = asyncHandler(async (req, res) => {
  const sites = await db.any(
    "SELECT * FROM sites WHERE user_id = $1 ORDER BY created_at DESC",
    [req.user.id]
  );

  res.json({
    success: true,
    data: sites,
  });
});

// @desc    Get single site
// @route   GET /api/sites/:id
// @access  Private
export const getSite = asyncHandler(async (req, res) => {
  const site = await db.oneOrNone(
    "SELECT * FROM sites WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.id]
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

// @desc    Update site
// @route   PUT /api/sites/:id
// @access  Private
export const updateSite = asyncHandler(async (req, res) => {
  const {
    siteName,
    siteAddress,
    opportunityType,
    developerName,
    developerRegion,
    googleMapsLink,
    lpa,
    region,
    planningStatus,
    landPurchaseStatus,
    plots,
    tenures,
    startOnSiteDate,
    handoverDate,
  } = req.body;

  const site = await db.oneOrNone(
    "SELECT * FROM sites WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.id]
  );

  if (!site) {
    res.status(404);
    throw new Error("Site not found");
  }

  const updatedSite = await db.one(
    `UPDATE sites SET
      site_name = $1,
      site_address = $2,
      opportunity_type = $3,
      developer_name = $4,
      developer_region = $5,
      google_maps_link = $6,
      lpa = $7,
      region = $8,
      planning_status = $9,
      land_purchase_status = $10,
      plots = $11,
      tenures = $12,
      start_on_site_date = $13,
      handover_date = $14,
      updated_at = NOW()
    WHERE id = $15 AND user_id = $16
    RETURNING *`,
    [
      siteName,
      siteAddress,
      opportunityType,
      developerName,
      developerRegion,
      googleMapsLink,
      lpa,
      region,
      planningStatus,
      landPurchaseStatus,
      plots,
      tenures,
      startOnSiteDate,
      handoverDate,
      req.params.id,
      req.user.id,
    ]
  );

  res.json({
    success: true,
    data: updatedSite,
  });
});

// @desc    Delete site
// @route   DELETE /api/sites/:id
// @access  Private
export const deleteSite = asyncHandler(async (req, res) => {
  const site = await db.oneOrNone(
    "SELECT * FROM sites WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.id]
  );

  if (!site) {
    res.status(404);
    throw new Error("Site not found");
  }

  await db.none("DELETE FROM sites WHERE id = $1 AND user_id = $2", [
    req.params.id,
    req.user.id,
  ]);

  res.json({
    success: true,
    data: {},
  });
});
