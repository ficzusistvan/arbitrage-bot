import express from 'express'
let router: express.Router = express.Router();

import opportunityRouter from "./opportunity";
import exchangeRouter from "./exchange";
//const productRoutes = require("./product");

router.use("/opportunity", opportunityRouter);
router.use("/exchange", exchangeRouter);
//router.use("/product", productRoutes);

export = router;