const express = require("express");
const { register } = require("../../controllers/v1/registerController");

const router = express.Router();

module.exports = (app) => {
  // Add the /api/v1 prefix here
  app.use("/register", router);

  router.post("/", register);
};