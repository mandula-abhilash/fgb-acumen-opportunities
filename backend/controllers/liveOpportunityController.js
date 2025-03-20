import asyncHandler from "express-async-handler";
import db from "../config/db.js";
import { UserModel } from "../models/User.js";
import { sendInterestNotification } from "../utils/ses.js";

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
  const userId = req.user.userId;
  const {
    regions,
    plotsMode,
    plotsMin,
    plotsMax,
    plotsValue,
    planningStatus,
    landPurchaseStatus,
    startDateMode,
    startDateStart,
    startDateEnd,
    startDateSingle,
    firstHandoverDateMode,
    firstHandoverDateStart,
    firstHandoverDateEnd,
    firstHandoverDateSingle,
    finalHandoverDateMode,
    finalHandoverDateStart,
    finalHandoverDateEnd,
    finalHandoverDateSingle,
    showShortlisted,
  } = req.query;

  // Parse regions from query string
  const selectedRegions = regions ? regions.split(",") : [];

  // Build the base query
  let query = `
    WITH shortlisted AS (
      SELECT opportunity_id, true as is_shortlisted
      FROM shortlists
      WHERE user_id = $1
    )
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
      o.updated_at,
      COALESCE(s.is_shortlisted, false) as is_shortlisted
    FROM live_opportunities o
    LEFT JOIN local_planning_authorities l ON l.lpa22cd = ANY(o.lpa)
    LEFT JOIN custom_regions r ON r.id::uuid = ANY(o.region::uuid[])
    LEFT JOIN shortlisted s ON s.opportunity_id = o.id
  `;

  // Build conditions array and params array
  const conditions = [];
  const params = [userId]; // First parameter is always userId for shortlist check

  // Add user filter for non-admin users
  if (!isAdmin) {
    conditions.push(`o.user_id = $${params.length + 1}`);
    params.push(userId);
  }

  // Add shortlisted filter
  if (showShortlisted === "true") {
    conditions.push(`EXISTS (
      SELECT 1 FROM shortlists
      WHERE shortlists.opportunity_id = o.id
      AND shortlists.user_id = $1
    )`);
  }

  // Add region filter if regions are selected
  if (selectedRegions.length > 0) {
    conditions.push(`o.region && $${params.length + 1}::text[]`);
    params.push(selectedRegions);
  }

  // Add plots filter based on mode
  if (plotsMode) {
    switch (plotsMode) {
      case "between":
        if (plotsMin && plotsMax) {
          conditions.push(
            `o.plots >= $${params.length + 1} AND o.plots <= $${
              params.length + 2
            }`
          );
          params.push(parseInt(plotsMin), parseInt(plotsMax));
        }
        break;
      case "more-than":
        if (plotsValue) {
          conditions.push(`o.plots > $${params.length + 1}`);
          params.push(parseInt(plotsValue));
        }
        break;
      case "less-than":
        if (plotsValue) {
          conditions.push(`o.plots < $${params.length + 1}`);
          params.push(parseInt(plotsValue));
        }
        break;
    }
  }

  // Add planning status filter
  if (planningStatus) {
    const statuses = planningStatus.split(",");
    conditions.push(`o.planning_status = ANY($${params.length + 1}::text[])`);
    params.push(statuses);
  }

  // Add land purchase status filter
  if (landPurchaseStatus) {
    const statuses = landPurchaseStatus.split(",");
    conditions.push(
      `o.land_purchase_status = ANY($${params.length + 1}::text[])`
    );
    params.push(statuses);
  }

  // Add start date filter
  if (startDateMode) {
    switch (startDateMode) {
      case "between":
        if (startDateStart && startDateEnd) {
          conditions.push(
            `o.start_on_site_date >= $${
              params.length + 1
            }::date AND o.start_on_site_date <= $${params.length + 2}::date`
          );
          params.push(
            formatDateParam(startDateStart),
            formatDateParam(startDateEnd)
          );
        }
        break;
      case "before":
        if (startDateSingle) {
          conditions.push(
            `o.start_on_site_date <= $${params.length + 1}::date`
          );
          params.push(formatDateParam(startDateSingle));
        }
        break;
      case "after":
        if (startDateSingle) {
          conditions.push(
            `o.start_on_site_date >= $${params.length + 1}::date`
          );
          params.push(formatDateParam(startDateSingle));
        }
        break;
    }
  }

  // Add first handover date filter
  if (firstHandoverDateMode) {
    switch (firstHandoverDateMode) {
      case "between":
        if (firstHandoverDateStart && firstHandoverDateEnd) {
          conditions.push(
            `o.first_handover_date >= $${
              params.length + 1
            }::date AND o.first_handover_date <= $${params.length + 2}::date`
          );
          params.push(
            formatDateParam(firstHandoverDateStart),
            formatDateParam(firstHandoverDateEnd)
          );
        }
        break;
      case "before":
        if (firstHandoverDateSingle) {
          conditions.push(
            `o.first_handover_date <= $${params.length + 1}::date`
          );
          params.push(formatDateParam(firstHandoverDateSingle));
        }
        break;
      case "after":
        if (firstHandoverDateSingle) {
          conditions.push(
            `o.first_handover_date >= $${params.length + 1}::date`
          );
          params.push(formatDateParam(firstHandoverDateSingle));
        }
        break;
    }
  }

  // Add final handover date filter
  if (finalHandoverDateMode) {
    switch (finalHandoverDateMode) {
      case "between":
        if (finalHandoverDateStart && finalHandoverDateEnd) {
          conditions.push(
            `o.final_handover_date >= $${
              params.length + 1
            }::date AND o.final_handover_date <= $${params.length + 2}::date`
          );
          params.push(
            formatDateParam(finalHandoverDateStart),
            formatDateParam(finalHandoverDateEnd)
          );
        }
        break;
      case "before":
        if (finalHandoverDateSingle) {
          conditions.push(
            `o.final_handover_date <= $${params.length + 1}::date`
          );
          params.push(formatDateParam(finalHandoverDateSingle));
        }
        break;
      case "after":
        if (finalHandoverDateSingle) {
          conditions.push(
            `o.final_handover_date >= $${params.length + 1}::date`
          );
          params.push(formatDateParam(finalHandoverDateSingle));
        }
        break;
    }
  }

  // Add WHERE clause if there are conditions
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  // Add group by clause
  query += ` GROUP BY o.id, s.is_shortlisted ORDER BY o.created_at DESC`;

  try {
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
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch opportunities",
    });
  }
});

// @desc    Get single opportunity (with full details)
// @route   GET /api/live-opportunities/:id
// @access  Private
export const getLiveOpportunitySite = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const userId = req.user.userId;

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
    ),
    shortlisted AS (
      SELECT true as is_shortlisted
      FROM shortlists
      WHERE user_id = $2 AND opportunity_id = $1
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
      (SELECT names FROM developer_region_names) as developer_region_names,
      COALESCE((SELECT is_shortlisted FROM shortlisted), false) as is_shortlisted
    FROM live_opportunities o
    LEFT JOIN local_planning_authorities l ON l.lpa22cd = ANY(o.lpa)
    LEFT JOIN custom_regions r ON r.id::uuid = ANY(o.region::uuid[])
    WHERE o.id = $1 ${isAdmin ? "" : "AND o.user_id = $2"}
    GROUP BY o.id
  `;

  const params = isAdmin ? [req.params.id, userId] : [req.params.id, userId];

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
    is_shortlisted: site.is_shortlisted,
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
