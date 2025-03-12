import asyncHandler from "express-async-handler";
import db from "../config/db.js";

// @desc    Create a new opportunity
// @route   POST /api/live-opportunities
// @access  Private
export const createLiveOpportunitySite = asyncHandler(async (req, res) => {
  const {
    siteName,
    siteAddress,
    customSiteAddress,
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
    developerInfo,
    siteContext,
    planningOverview,
    proposedDevelopment,
    detailedTenureAccommodation,
    paymentTerms,
    projectProgramme,
    agentTerms,
    sitePlanImage,
    proposedSpecification,
    s106Agreement,
    vatPosition,
  } = req.body;

  // Get the authenticated user's ID from the session
  const userId = req.user.userId;

  if (!userId) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  const site = await db.one(
    `INSERT INTO live_opportunities (
      site_name, 
      site_address, 
      custom_site_address,
      opportunity_type,
      developer_name, 
      developer_region,
      google_maps_link, 
      lpa, 
      region, 
      planning_status, 
      land_purchase_status,
      plots, 
      tenures, 
      start_on_site_date, 
      handover_date,
      developer_info,
      site_context,
      planning_overview,
      proposed_development,
      detailed_tenure_accommodation,
      payment_terms,
      project_programme,
      agent_terms,
      site_plan_image,
      proposed_specification,
      s106_agreement,
      vat_position,
      user_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
      $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28
    ) RETURNING *`,
    [
      siteName,
      siteAddress,
      customSiteAddress,
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
      developerInfo,
      siteContext,
      planningOverview,
      proposedDevelopment,
      detailedTenureAccommodation,
      paymentTerms,
      projectProgramme,
      agentTerms,
      sitePlanImage,
      proposedSpecification,
      s106Agreement,
      vatPosition,
      userId,
    ]
  );

  res.status(201).json({
    success: true,
    data: site,
  });
});

// @desc    Get all opportunities
// @route   GET /api/live-opportunities
// @access  Private
export const getLiveOpportunitySites = asyncHandler(async (req, res) => {
  const sites = await db.any(
    "SELECT * FROM live_opportunities WHERE user_id = $1 ORDER BY created_at DESC",
    [req.user.userId]
  );

  res.json({
    success: true,
    data: sites,
  });
});

// @desc    Get single opportunity
// @route   GET /api/live-opportunities/:id
// @access  Private
export const getLiveOpportunitySite = asyncHandler(async (req, res) => {
  const site = await db.oneOrNone(
    "SELECT * FROM live_opportunities WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.userId]
  );

  if (!site) {
    res.status(404);
    throw new Error("Opportunity not found");
  }

  res.json({
    success: true,
    data: site,
  });
});

// @desc    Update opportunity
// @route   PUT /api/live-opportunities/:id
// @access  Private
export const updateLiveOpportunitySite = asyncHandler(async (req, res) => {
  const {
    siteName,
    siteAddress,
    customSiteAddress,
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
    developerInfo,
    siteContext,
    planningOverview,
    proposedDevelopment,
    detailedTenureAccommodation,
    paymentTerms,
    projectProgramme,
    agentTerms,
    sitePlanImage,
    proposedSpecification,
    s106Agreement,
    vatPosition,
  } = req.body;

  const site = await db.oneOrNone(
    "SELECT * FROM live_opportunities WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.userId]
  );

  if (!site) {
    res.status(404);
    throw new Error("Opportunity not found");
  }

  const updatedSite = await db.one(
    `UPDATE live_opportunities SET
      site_name = $1,
      site_address = $2,
      custom_site_address = $3,
      opportunity_type = $4,
      developer_name = $5,
      developer_region = $6,
      google_maps_link = $7,
      lpa = $8,
      region = $9,
      planning_status = $10,
      land_purchase_status = $11,
      plots = $12,
      tenures = $13,
      start_on_site_date = $14,
      handover_date = $15,
      developer_info = $16,
      site_context = $17,
      planning_overview = $18,
      proposed_development = $19,
      detailed_tenure_accommodation = $20,
      payment_terms = $21,
      project_programme = $22,
      agent_terms = $23,
      site_plan_image = $24,
      proposed_specification = $25,
      s106_agreement = $26,
      vat_position = $27,
      updated_at = NOW()
    WHERE id = $28 AND user_id = $29
    RETURNING *`,
    [
      siteName,
      siteAddress,
      customSiteAddress,
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
      developerInfo,
      siteContext,
      planningOverview,
      proposedDevelopment,
      detailedTenureAccommodation,
      paymentTerms,
      projectProgramme,
      agentTerms,
      sitePlanImage,
      proposedSpecification,
      s106Agreement,
      vatPosition,
      req.params.id,
      req.user.userId,
    ]
  );

  res.json({
    success: true,
    data: updatedSite,
  });
});

// @desc    Delete opportunity
// @route   DELETE /api/live-opportunities/:id
// @access  Private
export const deleteLiveOpportunitySite = asyncHandler(async (req, res) => {
  const site = await db.oneOrNone(
    "SELECT * FROM live_opportunities WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.userId]
  );

  if (!site) {
    res.status(404);
    throw new Error("Opportunity not found");
  }

  await db.none(
    "DELETE FROM live_opportunities WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.userId]
  );

  res.json({
    success: true,
    data: {},
  });
});
