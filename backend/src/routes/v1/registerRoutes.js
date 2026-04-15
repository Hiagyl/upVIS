const { Router } = require("express");
const { registerScholar } = require("../../controllers/v1/registerController");

const route = Router();

module.exports = (app) => {
    app.use("/register", route);
    route.post("/", registerScholar);
};