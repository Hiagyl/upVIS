const {
  login,
  checkStatus,
  logout,
} = require("../../controllers/v1/loginController");

module.exports = (router) => {

  router.post("/login", login);

  router.get("/login/me", checkStatus);

  router.post("/login/logout", logout);
};
