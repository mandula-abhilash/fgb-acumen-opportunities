export function up(knex) {
  return knex.schema.createTable("sites", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("site_name").notNullable();
    table.string("site_address").notNullable();
    table.specificType("lpa", "text[]").notNullable();
    table.specificType("region", "text[]").notNullable();
    table.string("developer_name").notNullable();
    table.string("developer_region");
    table.integer("plots").notNullable();
    table.specificType("tenures", "text[]").notNullable();
    table.string("google_maps_link").notNullable();
    table.string("planning_status").notNullable();
    table.string("land_purchase_status").notNullable();
    table.date("start_on_site_date");
    table.date("handover_date");
    table.text("developer_info");
    table.text("site_context");
    table.text("planning_overview");
    table.text("proposed_development");
    table.text("detailed_tenure_accommodation");
    table.text("payment_terms");
    table.text("project_programme");
    table.text("agent_terms");

    // PostGIS support
    table.specificType("geom", "GEOMETRY(Point, 4326)");

    // Foreign Key
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable("sites");
}
