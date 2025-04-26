import asyncHandler from "express-async-handler";
import db from "../../config/db.js";

// Helper function to format date parameter
const formatDateParam = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toISOString().split("T")[0];
};

// @desc    Get all opportunities (with minimal data for list view)
// @route   GET /api/live-opportunities
// @access  Private
export const getLiveOpportunitySites = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const userId = req.user.userId;
  const userRole = req.user.role;

  // Build the base query with role-based conditions
  let roleCondition = "";
  if (userRole === "seller") {
    roleCondition = "AND o.user_id = $1";
  } else if (userRole === "buyer") {
    roleCondition = "AND o.status = 'published'";
  }

  const {
    regions,
    plotsMode,
    plotsMin,
    plotsMax,
    plotsValue,
    planningStatus,
    landPurchaseStatus,
    opportunityType,
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
    siteAddedDateMode,
    siteAddedDateStart,
    siteAddedDateEnd,
    siteAddedDateSingle,
    showShortlisted,
    showDrafts,
    status,
  } = req.query;

  // Build the base query
  let query = `
      WITH shortlisted AS (
        SELECT opportunity_id, true as is_shortlisted
        FROM shortlists
        WHERE user_id = $1
      )
      SELECT 
        o.*,
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
      WHERE 1=1 ${roleCondition}
    `;

  // Build conditions array and params array
  const conditions = [];
  const params = [userId];

  // Add status filter for admin viewing drafts
  if (isAdmin && showDrafts === "true") {
    conditions.push(`o.status = 'draft'`);
  } else if (isAdmin && status === "draft") {
    conditions.push(`o.status = 'draft'`);
  } else if (!isAdmin) {
    conditions.push(`o.status = 'published'`);
  }

  // Add shortlisted filter
  if (showShortlisted === "true") {
    conditions.push(`EXISTS (
        SELECT 1 FROM shortlists
        WHERE shortlists.opportunity_id = o.id
        AND shortlists.user_id = $1
      )`);
  }

  // Add region filter
  if (regions) {
    const selectedRegions = regions.split(",");
    conditions.push(`o.region && $${params.length + 1}::text[]`);
    params.push(selectedRegions);
  }

  // Add opportunity type filter
  if (opportunityType) {
    const types = opportunityType.split(",");
    conditions.push(`o.opportunity_type = ANY($${params.length + 1}::text[])`);
    params.push(types);
  }

  // Add plots filter
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

  // Add site added date filter
  if (siteAddedDateMode) {
    switch (siteAddedDateMode) {
      case "between":
        if (siteAddedDateStart && siteAddedDateEnd) {
          conditions.push(
            `o.site_added_to_portal_date >= $${
              params.length + 1
            }::date AND o.site_added_to_portal_date <= $${
              params.length + 2
            }::date`
          );
          params.push(
            formatDateParam(siteAddedDateStart),
            formatDateParam(siteAddedDateEnd)
          );
        }
        break;
      case "before":
        if (siteAddedDateSingle) {
          conditions.push(
            `o.site_added_to_portal_date <= $${params.length + 1}::date`
          );
          params.push(formatDateParam(siteAddedDateSingle));
        }
        break;
      case "after":
        if (siteAddedDateSingle) {
          conditions.push(
            `o.site_added_to_portal_date >= $${params.length + 1}::date`
          );
          params.push(formatDateParam(siteAddedDateSingle));
        }
        break;
    }
  }

  // Add WHERE clause if there are conditions
  if (conditions.length > 0) {
    query += ` AND ${conditions.join(" AND ")}`;
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
