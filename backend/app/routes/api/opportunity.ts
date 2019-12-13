import express from 'express'
import nconf from 'nconf'
nconf.file({
  file: 'config.json',
  search: true
});
import knex from '../../db/knex'
let router: express.Router = express.Router();

router.get('/list', /*roles.can('api/opportunity'),*/ async function (req, res, next) {
  const pageSize: number = Number(req.query.pageSize);
  const page: number = Number(req.query.page);
  const opps = await knex('opportunities').orderBy('dt_server', 'desc').limit(pageSize).offset(pageSize * page).select();
  const count = await knex('opportunities').count();
  console.log(count[0]['count(*)']);
  res.json({ pages: Math.ceil(count[0]['count(*)'] / pageSize), rows: opps });
});

router.delete('/all', async function (req, res, next) {
  await knex('opportunities').del();
  res.end();
});

export = router;