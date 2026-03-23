
const { Router } = require("express");
const scholarController = require("../../controllers/v1/scholarController");

const route = Router();
module.exports = (app) => {
    app.use("/scholars", route);

    route.get('/', scholarController.getScholars);
    route.post('/', scholarController.createScholar);
    route.put('/:id', scholarController.updateScholar);
    route.delete('/:id', scholarController.deleteScholar);

}