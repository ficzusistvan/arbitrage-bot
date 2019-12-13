import * as Knex from "knex";

const PRECISION = 12;
const SCALE = 6;

export async function up(knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.createTable('opportunities', t => {
      t.increments();
      t.string('direction').notNullable();
      t.decimal('ask_price', PRECISION, SCALE).notNullable();
      t.decimal('ask_quantity', PRECISION, SCALE).notNullable();
      t.decimal('bid_price', PRECISION, SCALE).notNullable();
      t.decimal('bid_quantity', PRECISION, SCALE).notNullable();
      t.dateTime('dt_server').notNullable();
    })
  ])
}


export async function down(knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.dropTable('opportunities')
  ])
}
