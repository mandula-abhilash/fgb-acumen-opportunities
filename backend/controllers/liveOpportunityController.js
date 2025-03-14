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
    firstHandoverDate,
    finalHandoverDate,
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
    coordinates,
  } = req.body;

  // Get the authenticated user's ID from the session
  const userId = req.user.userId;

  if (!userId) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  // Extract region values from the developer region array
  const developerRegionValues = Array.isArray(developerRegion)
    ? developerRegion.map((region) => region.value || region)
    : [];

  // Format dates to ensure they are treated as UTC midnight
  const formatDate = (dateString) => {
    if (!dateString) return null;
    // Create a new Date object from the input string and format it as YYYY-MM-DD
    return new Date(dateString).toISOString().split("T")[0];
  };

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
      first_handover_date,
      final_handover_date,
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
      user_id,
      geom
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
      $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29,
      ST_SetSRID(ST_MakePoint($30, $31), 4326)
    ) RETURNING *`,
    [
      siteName,
      siteAddress,
      customSiteAddress,
      opportunityType.value || opportunityType,
      developerName,
      developerRegionValues,
      googleMapsLink,
      lpa,
      region,
      planningStatus,
      landPurchaseStatus,
      plots,
      tenures,
      formatDate(startOnSiteDate),
      formatDate(firstHandoverDate),
      formatDate(finalHandoverDate),
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
      coordinates?.lng || null,
      coordinates?.lat || null,
    ]
  );

  res.status(201).json({
    success: true,
    data: site,
  });
});

// @desc    Get all opportunities (with minimal data for list view)
// @route   GET /api/live-opportunities
// @access  Private
export const getLiveOpportunitySites = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";

  // Only fetch fields needed for the list view
  const query = `
    SELECT 
      o.id,
      o.site_name,
      o.site_address,
      o.opportunity_type,
      o.developer_name,
      o.plots,
      o.planning_status,
      o.land_purchase_status,
      o.tenures,
      o.site_plan_image,
      ST_X(o.geom) as longitude,
      ST_Y(o.geom) as latitude,
      ARRAY_AGG(DISTINCT l.lpa22nm) as lpa_names,
      ARRAY_AGG(DISTINCT r.name) as region_names,
      o.created_at,
      o.updated_at
    FROM live_opportunities o
    LEFT JOIN local_planning_authorities l ON l.lpa22cd = ANY(o.lpa)
    LEFT JOIN custom_regions r ON r.id::uuid = ANY(o.region::uuid[])
    ${isAdmin ? "" : "WHERE o.user_id = $1"}
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  const params = isAdmin ? [] : [req.user.userId];

  const sites = await db.any(query, params);

  // Transform the response to include both IDs and names
  const transformedSites = sites.map((site) => ({
    ...site,
    lpa_names: site.lpa_names.filter(Boolean), // Remove null values
    region_names: site.region_names.filter(Boolean), // Remove null values
    coordinates: {
      lat: parseFloat(site.latitude),
      lng: parseFloat(site.longitude),
    },
  }));

  res.json({
    success: true,
    data: transformedSites,
  });
});

// @desc    Get single opportunity (with full details)
// @route   GET /api/live-opportunities/:id
// @access  Private
export const getLiveOpportunitySite = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";

  const query = `
    WITH developer_region_names AS (
      SELECT 
        ARRAY_AGG(r.name) as names
      FROM custom_regions r
      WHERE r.id = ANY(
        SELECT UNNEST(developer_region::uuid[])
        FROM live_opportunities
        WHERE id = $1
      )
    )
    SELECT 
      o.*,
      ST_X(o.geom) as longitude,
      ST_Y(o.geom) as latitude,
      ARRAY_AGG(DISTINCT l.lpa22nm) as lpa_names,
      ARRAY_AGG(DISTINCT r.name) as region_names,
      ARRAY_AGG(DISTINCT l.lpa22cd) as lpa_codes,
      ARRAY_AGG(DISTINCT r.id) as region_ids,
      ARRAY_AGG(DISTINCT r.description) as region_descriptions,
      (SELECT names FROM developer_region_names) as developer_region_names
    FROM live_opportunities o
    LEFT JOIN local_planning_authorities l ON l.lpa22cd = ANY(o.lpa)
    LEFT JOIN custom_regions r ON r.id::uuid = ANY(o.region::uuid[])
    WHERE o.id = $1 ${isAdmin ? "" : "AND o.user_id = $2"}
    GROUP BY o.id
  `;

  const params = isAdmin ? [req.params.id] : [req.params.id, req.user.userId];

  const site = await db.oneOrNone(query, params);

  if (!site) {
    res.status(404);
    throw new Error("Opportunity not found or unauthorized");
  }

  // Transform the response
  const transformedSite = {
    ...site,
    // Basic Information
    siteName: site.site_name,
    siteAddress: site.site_address,
    customSiteAddress: site.custom_site_address,
    opportunityType: site.opportunity_type,
    plots: parseInt(site.plots),
    sitePlanImage: site.site_plan_image,

    // Developer Information
    developerName: site.developer_name,
    developerRegion: site.developer_region,
    developerInfo: site.developer_info,

    // Location Information
    lpa: site.lpa,
    lpa_names: site.lpa_names.filter(Boolean),
    lpa_codes: site.lpa_codes.filter(Boolean),
    region: site.region,
    region_names: site.region_names.filter(Boolean),
    region_ids: site.region_ids.filter(Boolean),
    region_descriptions: site.region_descriptions.filter(Boolean),
    googleMapsLink: site.google_maps_link,
    coordinates: {
      lat: parseFloat(site.latitude),
      lng: parseFloat(site.longitude),
    },

    // Planning Information
    planningStatus: site.planning_status,
    landPurchaseStatus: site.land_purchase_status,
    planningOverview: site.planning_overview,
    proposedDevelopment: site.proposed_development,
    proposedSpecification: site.proposed_specification,
    s106Agreement: site.s106_agreement,

    // Tenure Information
    tenures: site.tenures,
    detailedTenureAccommodation: site.detailed_tenure_accommodation,

    // Commercial Information
    paymentTerms: site.payment_terms,
    vatPosition: site.vat_position,
    agentTerms: site.agent_terms,

    // Timeline Information
    startOnSiteDate: site.start_on_site_date,
    firstHandoverDate: site.first_handover_date,
    finalHandoverDate: site.final_handover_date,
    projectProgramme: site.project_programme,

    // Additional Information
    siteContext: site.site_context,
    created_at: site.created_at,
    updated_at: site.updated_at,
    user_id: site.user_id,
  };

  res.json({
    success: true,
    data: transformedSite,
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
    firstHandoverDate,
    finalHandoverDate,
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
    coordinates,
  } = req.body;

  const isAdmin = req.user.role === "admin";

  // Check if the opportunity exists and if the user has permission to update it
  const query = isAdmin
    ? "SELECT * FROM live_opportunities WHERE id = $1"
    : "SELECT * FROM live_opportunities WHERE id = $1 AND user_id = $2";

  const params = isAdmin ? [req.params.id] : [req.params.id, req.user.userId];

  const site = await db.oneOrNone(query, params);

  if (!site) {
    res.status(404);
    throw new Error("Opportunity not found or unauthorized");
  }

  // Extract region values from the developer region array
  const developerRegionValues = Array.isArray(developerRegion)
    ? developerRegion.map((region) => region.value || region)
    : [];

  // Format dates to ensure they are treated as UTC midnight
  const formatDate = (dateString) => {
    if (!dateString) return null;
    // Create a new Date object from the input string and format it as YYYY-MM-DD
    return new Date(dateString).toISOString().split("T")[0];
  };

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
      first_handover_date = $15,
      final_handover_date = $16,
      developer_info = $17,
      site_context = $18,
      planning_overview = $19,
      proposed_development = $20,
      detailed_tenure_accommodation = $21,
      payment_terms = $22,
      project_programme = $23,
      agent_terms = $24,
      site_plan_image = $25,
      proposed_specification = $26,
      s106_agreement = $27,
      vat_position = $28,
      geom = ST_SetSRID(ST_MakePoint($31, $32), 4326),
      updated_at = NOW()
    WHERE id = $29 AND user_id = $30
    RETURNING *, ST_X(geom) as longitude, ST_Y(geom) as latitude`,
    [
      siteName,
      siteAddress,
      customSiteAddress,
      opportunityType.value || opportunityType,
      developerName,
      developerRegionValues,
      googleMapsLink,
      lpa,
      region,
      planningStatus,
      landPurchaseStatus,
      plots,
      tenures,
      formatDate(startOnSiteDate),
      formatDate(firstHandoverDate),
      formatDate(finalHandoverDate),
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
      coordinates?.lng || null,
      coordinates?.lat || null,
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
