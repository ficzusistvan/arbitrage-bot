import path from 'path'
import express from 'express'
let router: express.Router = express.Router();

import apiRouter from './api'
//const passportRoutes = require("./passport");

// API routes
router.use("/api", apiRouter);

// Passport.js routes
//router.use("/", passportRoutes);

// If no API routes are hit, send the React app
router.use((req, res) =>
  res.sendFile(path.join(__dirname, "../client/arbiter/build/index.html"))
);

export = router;
