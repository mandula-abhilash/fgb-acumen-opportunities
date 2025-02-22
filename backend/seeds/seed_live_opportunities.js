export function seed(knex) {
  // First, clean the tables
  return knex("site_files")
    .del()
    .then(() => knex("site_tags").del())
    .then(() => knex("sites").del())
    .then(() => {
      // Then insert seed data
      return knex("sites").insert([
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          site_name: "Greenfield Site",
          site_address: "123 Street, City, UK",
          lpa: ["LPA1", "LPA2"],
          region: ["Region1", "Region2"],
          developer_name: "ABC Developers",
          developer_region: "South East",
          plots: 50,
          tenures: ["social rent", "shared ownership"],
          google_maps_link: "https://goo.gl/maps/example",
          planning_status: "Approved",
          land_purchase_status: "Under Negotiation",
          start_on_site_date: "2025-05-01",
          handover_date: "2026-12-15",
          developer_info: "Developer information here",
          site_context: "Site context details",
          planning_overview: "Planning overview here",
          proposed_development: "Proposed development details",
          detailed_tenure_accommodation: "Tenure & accommodation details",
          payment_terms: "Payment terms info",
          project_programme: "Project schedule",
          agent_terms: "Agent terms info",
          geom: knex.raw("ST_SetSRID(ST_MakePoint(-0.1276, 51.5074), 4326)"),
          mongo_user_id: "65fb123456789abcdef12345", // Example MongoDB ObjectId
        },
      ]);
    })
    .then(() => {
      // Insert sample tags
      return knex("site_tags").insert([
        {
          site_id: "123e4567-e89b-12d3-a456-426614174000",
          tag: "Affordable Housing",
        },
        {
          site_id: "123e4567-e89b-12d3-a456-426614174000",
          tag: "Section 106",
        },
      ]);
    })
    .then(() => {
      // Insert sample files
      return knex("site_files").insert([
        {
          site_id: "123e4567-e89b-12d3-a456-426614174000",
          file_type: "planning_document",
          file_url: "https://example.com/planning.pdf",
          description: "Planning permission document",
        },
      ]);
    });
}
