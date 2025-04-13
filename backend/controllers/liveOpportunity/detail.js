import asyncHandler from "express-async-handler";
import db from "../../config/db.js";

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
    planningSubmissionDate: site.planning_submission_date,
    planningDeterminationDate: site.planning_determination_date,
    startOnSiteDate: site.start_on_site_date,
    firstGoldenBrickDate: site.first_golden_brick_date,
    finalGoldenBrickDate: site.final_golden_brick_date,
    firstHandoverDate: site.first_handover_date,
    finalHandoverDate: site.final_handover_date,
    siteAddedToPortalDate: site.site_added_to_portal_date,
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
