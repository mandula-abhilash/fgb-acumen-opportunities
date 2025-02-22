export function up(knex) {
  return knex.schema.createTable("site_tags", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("site_id").references("id").inTable("sites").onDelete("CASCADE");
    table.string("tag").notNullable();
  });
}

export function down(knex) {
  return knex.schema.dropTable("site_tags");
}
