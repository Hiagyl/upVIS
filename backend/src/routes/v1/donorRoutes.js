const { Router } = require("express");
const DonorController = require("../../controllers/v1/donorController");

const route = Router();

module.exports = (app) => {
    app.use("/donors", route);

    route.get("/", DonorController.getDonors);
    route.get("/:id", DonorController.getDonor);
    route.post("/", DonorController.createDonor);
    route.put("/:id", DonorController.updateDonor);
    route.delete("/:id", DonorController.deleteDonor);
};