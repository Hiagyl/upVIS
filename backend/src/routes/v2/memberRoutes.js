const { Router } = require("express");
const MemberController = require("../../controllers/v1/memberController");

const route = Router();

module.exports = (app) => {
    app.use("/members", route);

    route.get("/", MemberController.getMembers);
    route.get("/:id", MemberController.getMember);
    route.post("/", MemberController.createMember);
    route.put("/:id", MemberController.updateMember);
    route.delete("/:id", MemberController.deleteMember);
};