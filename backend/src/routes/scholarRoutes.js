
const { Router } = require("express");
const scholarController = require('../controllers/scholarController');

const route = Router();
module.exports = (app) => {
    app.use("/api/scholars", route);

    route.get('/', scholarController.getScholars);
    route.post('/', scholarController.createScholar);
    route.put('/:id', scholarController.updateScholar);
    route.delete('/:id', scholarController.deleteScholar);

}