export function up(knex) {
  return knex.schema.createTable("sites", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("site_name").notNullable();
    table.string("site_address").notNullable();
    table.string("opportunity_type").notNullable();
    table.string("developer_name").notNullable();
    table.string("developer_region");
    table.string("google_maps_link").notNullable();
    table.specificType("lpa", "text[]").notNullable();
    table.specificType("region", "text[]").notNullable();
    table.string("planning_status").notNullable();
    table.string("land_purchase_status").notNullable();
    table.jsonb("plots").notNullable();
    table.specificType("tenures", "text[]").notNullable();
    table.date("start_on_site_date");
    table.date("handover_date");
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
