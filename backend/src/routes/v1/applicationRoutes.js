const { Router } = require("express");
const applicationController = require("../../controllers/v1/applicationController");

const route = Router();

module.exports = (app) => {
  app.use("/applications", route);

  route.post("/", applicationController.create);
  route.get("/", applicationController.getAll);
  route.get("/:id", applicationController.getById);
  route.patch("/:id/review", applicationController.review);
};
