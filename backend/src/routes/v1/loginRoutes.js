const express = require("express");
const { login } = require("../../controllers/v1/loginController");

const router = express.Router();

module.exports = (app) => {
  app.use("/login", router);

  router.post("/", login);
};
