const VoteService = require("../../services/v1/voteService");

class VoteController {
    async castVote(req, res, next) {
        try {
            // scholarId comes from session
            const scholarId = req.session.scholarId;
            if (!scholarId)
                return res.status(401).json({ success: false, message: "Unauthorized" });

            const { pollId, selectedOption } = req.body;
            const vote = await VoteService.castVote(pollId, scholarId, selectedOption);
            res.status(201).json({ success: true, data: vote });
        } catch (err) {
            next(err);
        }
    }

    async getVotesByPoll(req, res, next) {
        try {
            const votes = await VoteService.getVotesByPoll(req.params.pollId);
            res.status(200).json({ success: true, count: votes.length, data: votes });
        } catch (err) {
            next(err);
        }
    }

    async getVoteByScholar(req, res, next) {
        try {
            const scholarId = req.session.scholarId;
            if (!scholarId)
                return res.status(401).json({ success: false, message: "Unauthorized" });

            const vote = await VoteService.getVoteByScholar(req.params.pollId, scholarId);
            res.status(200).json({ success: true, data: vote });
        } catch (err) {
            next(err);
        }
    }

    async changeVote(req, res, next) {
        try {
            const scholarId = req.session.scholarId;
            if (!scholarId)
                return res.status(401).json({ success: false, message: "Unauthorized" });

            const { pollId } = req.params;
            const { selectedOption } = req.body;

            if (!selectedOption)
                return res.status(400).json({ success: false, message: "selectedOption is required" });

            const updatedVote = await VoteService.changeVote(pollId, scholarId, selectedOption);
            res.status(200).json({ success: true, data: updatedVote });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new VoteController();