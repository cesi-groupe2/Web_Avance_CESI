const express = require("express");
const {healthCheck} = require("../database/connexion.js");

function apiRoads(app) {
  let api = express.Router();
  app.use("/api", api);

  // groupe /api
  api.get("/hello", (_, res) => {
    res.json({ message: "Hello World from Easeat backend!" });
  });

  api.get("/health", (_, res) => {
    const state = healthCheck();
    res.json({ state });
  });
}

module.exports = { apiRoads };
