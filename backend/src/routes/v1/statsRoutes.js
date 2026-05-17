const statsController = require("../../controllers/v1/statsController");

module.exports = (router) => {
  router.get("/stats/landing", statsController.getLandingStats);
};
