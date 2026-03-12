const { Router } = require("express");
const DistributionController = require("../controllers/distributionController");

const route = Router();

module.exports = (app) => {
    app.use("/api/distributions", route);

    route.get("/", DistributionController.getDistributions);
    route.get("/:id", DistributionController.getDistribution);
    route.post("/", DistributionController.createDistribution);
    route.put("/:id", DistributionController.updateDistribution);
    route.delete("/:id", DistributionController.deleteDistribution);
};