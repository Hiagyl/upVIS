const PollService = require("../../services/v1/pollService");

class PollController {
    async getAllPolls(req, res, next) {
        try {
            const polls = await PollService.getAllPolls();
            res.status(200).json({ success: true, count: polls.length, data: polls });
        } catch (err) {
            next(err);
        }
    }

    async getPoll(req, res, next) {
        try {
            const poll = await PollService.getPollById(req.params.id);
            if (!poll) return res.status(404).json({ success: false, message: "Poll not found" });
            res.status(200).json({ success: true, data: poll });
        } catch (err) {
            next(err);
        }
    }

    async createPoll(req, res, next) {
        try {
            // adminId comes from session
            const adminId = req.session.userId;
            if (!adminId)
                return res.status(401).json({ success: false, message: "Unauthorized" });

            const poll = await PollService.createPoll(req.body, adminId);
            res.status(201).json({ success: true, data: poll });
        } catch (err) {
            next(err);
        }
    }

    async updatePoll(req, res, next) {
        try {
            const adminId = req.session.userId;
            if (!adminId)
                return res.status(401).json({ success: false, message: "Unauthorized" });

            const poll = await PollService.updatePoll(req.params.id, req.body, adminId);
            res.status(200).json({ success: true, data: poll });
        } catch (err) {
            next(err);
        }
    }

    async closePoll(req, res, next) {
        try {
            const adminId = req.session.userId;
            if (!adminId)
                return res.status(401).json({ success: false, message: "Unauthorized" });

            const poll = await PollService.closePoll(req.params.id, adminId);
            res.status(200).json({ success: true, data: poll });
        } catch (err) {
            next(err);
        }
    }

    async deletePoll(req, res, next) {
        try {
            const adminId = req.session.userId;
            if (!adminId)
                return res.status(401).json({ success: false, message: "Unauthorized" });

            await PollService.deletePoll(req.params.id, adminId);
            res.status(200).json({ success: true, message: "Poll deleted successfully" });
        } catch (err) {
            next(err);
        }
    }

    async getPollResults(req, res, next) {
        try {
            const results = await PollService.getPollResults(req.params.id);
            res.status(200).json({ success: true, data: results });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new PollController();