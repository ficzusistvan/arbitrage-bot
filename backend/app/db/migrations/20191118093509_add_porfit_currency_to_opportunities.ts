import * as Knex from "knex";

const PRECISION = 12;
const SCALE = 6;

export async function up(knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.alterTable('opportunities', t => {
      t.string('profit_currency', 5).notNullable().defaultTo(0);
    })
  ])
}


export async function down(knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.alterTable('opportunities', t => {
      t.dropColumn('profit_currency')
    })
  ])
}
