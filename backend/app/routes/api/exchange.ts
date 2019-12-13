import express from 'express'
import nconf from 'nconf'
nconf.file({
  file: 'config.json',
  search: true
});
let router: express.Router = express.Router();

router.get('/list', /*roles.can('api/opportunity'),*/ async function (req, res, next) {
  res.json({ exchange1: nconf.get('exchange1:name'), exchange2: nconf.get('exchange2:name') });
});

router.get('/currency-pair', /*roles.can('api/opportunity'),*/ async function (req, res, next) {
  res.json({ currencyPair1: nconf.get('exchange1:symbol'), currencyPair2: nconf.get('exchange2:symbol') });
});

export = router;