import asyncHandler from "express-async-handler";
import db from "../../config/db.js";
import { UserModel } from "../../models/User.js";
import { sendAdminNotifications } from "../../utils/email.js";

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
    planningSubmissionDate,
    planningDeterminationDate,
    startOnSiteDate,
    firstGoldenBrickDate,
    finalGoldenBrickDate,
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
    sitePlanDocument,
    proposedSpecification,
    s106Agreement,
    vatPosition,
    coordinates,
    boundary,
    planningApplicationReference,
    planningApplicationUrl,
    additionalDocuments = [],
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

  // Validate and format boundary data
  let boundaryGeometry = null;
  if (
    boundary &&
    typeof boundary === "object" &&
    boundary.type === "Polygon" &&
    Array.isArray(boundary.coordinates)
  ) {
    try {
      boundaryGeometry = JSON.stringify(boundary);
    } catch (error) {
      console.error("Error stringifying boundary:", error);
      boundaryGeometry = null;
    }
  }

  // Format additional documents as JSONB
  const formattedAdditionalDocuments = Array.isArray(additionalDocuments)
    ? JSON.stringify(additionalDocuments)
    : "[]";

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
      planning_submission_date,
      planning_determination_date,
      start_on_site_date, 
      first_golden_brick_date,
      final_golden_brick_date,
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
      site_plan_document,
      proposed_specification,
      s106_agreement,
      vat_position,
      user_id,
      geom,
      boundary,
      status,
      site_added_to_portal_date,
      planning_application_reference,
      planning_application_url,
      additional_documents
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
      $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34,
      ST_SetSRID(ST_MakePoint($35, $36), 4326),
      CASE 
        WHEN $37::jsonb IS NOT NULL 
        THEN ST_SetSRID(ST_GeomFromGeoJSON($37), 4326)
        ELSE NULL
      END,
      'draft',
      CURRENT_DATE,
      $38,
      $39,
      $40::jsonb
    ) RETURNING *`,
    [
      siteName,
      siteAddress,
      customSiteAddress || siteAddress,
      opportunityType,
      developerName,
      developerRegionValues,
      googleMapsLink,
      lpa,
      region,
      planningStatus,
      landPurchaseStatus,
      plots,
      tenures,
      formatDate(planningSubmissionDate),
      formatDate(planningDeterminationDate),
      formatDate(startOnSiteDate),
      formatDate(firstGoldenBrickDate),
      formatDate(finalGoldenBrickDate),
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
      sitePlanDocument,
      proposedSpecification,
      s106Agreement,
      vatPosition,
      userId,
      coordinates?.lng || null,
      coordinates?.lat || null,
      boundaryGeometry,
      planningApplicationReference,
      planningApplicationUrl,
      formattedAdditionalDocuments,
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
});
