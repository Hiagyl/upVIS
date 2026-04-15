const { Router } = require("express");
const VoteController = require("../../controllers/v1/voteController");

const route = Router();

module.exports = (app) => {
    app.use("/votes", route);

    route.post("/", VoteController.castVote);
    route.get("/poll/:pollId", VoteController.getVotesByPoll);
    route.get("/poll/:pollId/my-vote", VoteController.getVoteByScholar);
};