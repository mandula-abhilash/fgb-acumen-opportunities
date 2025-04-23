import asyncHandler from "express-async-handler";
import db from "../../config/db.js";

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
    planningApplicationReference,
    planningApplicationUrl,
    additionalDocuments = [],
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

  try {
    // Use the site's original user_id for the update
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
        planning_submission_date = $14,
        planning_determination_date = $15,
        start_on_site_date = $16,
        first_golden_brick_date = $17,
        final_golden_brick_date = $18,
        first_handover_date = $19,
        final_handover_date = $20,
        developer_info = $21,
        site_context = $22,
        planning_overview = $23,
        proposed_development = $24,
        detailed_tenure_accommodation = $25,
        payment_terms = $26,
        project_programme = $27,
        agent_terms = $28,
        site_plan_image = $29,
        site_plan_document = $30,
        proposed_specification = $31,
        s106_agreement = $32,
        vat_position = $33,
        geom = ST_SetSRID(ST_MakePoint($36, $37), 4326),
        planning_application_reference = $38,
        planning_application_url = $39,
        additional_documents = $40::jsonb,
        updated_at = NOW()
      WHERE id = $34
      RETURNING *, ST_X(geom) as longitude, ST_Y(geom) as latitude`,
      [
        siteName,
        siteAddress,
        customSiteAddress || siteAddress,
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
        req.params.id,
        site.user_id,
        coordinates?.lng || null,
        coordinates?.lat || null,
        planningApplicationReference,
        planningApplicationUrl,
        JSON.stringify(additionalDocuments),
      ]
    );

    res.json({
      success: true,
      data: updatedSite,
    });
  } catch (error) {
    console.error("Database update error:", error);
    throw new Error("Failed to update opportunity in database");
  }
});
