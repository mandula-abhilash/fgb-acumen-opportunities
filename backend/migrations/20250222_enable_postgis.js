export function up(knex) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "postgis"');
}

export function down(knex) {
  return knex.raw('DROP EXTENSION IF EXISTS "postgis"');
}
