const { Router } = require("express");
const PollController = require("../../controllers/v1/pollController");

const route = Router();

module.exports = (app) => {
    app.use("/polls", route);

    route.get("/", PollController.getAllPolls);
    route.get("/:id", PollController.getPoll);
    route.get("/:id/results", PollController.getPollResults);
    route.post("/", PollController.createPoll);
    route.put("/:id", PollController.updatePoll);
    route.patch("/:id/close", PollController.closePoll);
    route.delete("/:id", PollController.deletePoll);
};