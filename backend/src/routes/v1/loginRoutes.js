const { loginScholar, checkStatus, logoutScholar } = require("../../controllers/v1/loginController");

module.exports = (router) => {
    router.post("/login", loginScholar);
    router.get("/login/me", checkStatus);
    router.post("/login/logout", logoutScholar);
};