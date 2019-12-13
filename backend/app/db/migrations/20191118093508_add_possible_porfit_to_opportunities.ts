import * as Knex from "knex";

const PRECISION = 12;
const SCALE = 6;

export async function up(knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.alterTable('opportunities', t => {
      t.decimal('possible_profit', PRECISION, SCALE).notNullable().defaultTo(0);
    })
  ])
}


export async function down(knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.alterTable('opportunities', t => {
      t.dropColumn('possible_profit')
    })
  ])
}
