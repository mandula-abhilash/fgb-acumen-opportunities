export function up(knex) {
  return knex.schema.createTable("site_files", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("site_id").references("id").inTable("sites").onDelete("CASCADE");
    table.string("file_type").notNullable();
    table.string("file_url").notNullable();
    table.string("description");
  });
}

export function down(knex) {
  return knex.schema.dropTable("site_files");
}
