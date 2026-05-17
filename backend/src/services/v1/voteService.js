const Vote = require("../../models/v1/Vote");
const Poll = require("../../models/v1/Poll");

class VoteService {
    async castVote(pollId, scholarId, selectedOption) {
        const poll = await Poll.findById(pollId);
        if (!poll) throw new Error("Poll not found");

        // Block voting if poll is closed
        if (poll.status === "closed")
            throw new Error("This poll is closed");

        // Block voting if poll has expired
        const now = new Date();
        if (now < poll.startDate)
            throw new Error("This poll has not started yet");
        if (now > poll.endDate)
            throw new Error("This poll has expired");

        // Validate selected option
        if (!poll.options.includes(selectedOption))
            throw new Error("Invalid option selected");

        // Check if scholar has already voted — unique index will also catch this
        const existing = await Vote.findOne({ pollId, scholarId });
        if (existing) throw new Error("You have already voted on this poll");

        return await Vote.create({ pollId, scholarId, selectedOption });
    }

    async getVotesByPoll(pollId) {
        return await Vote.find({ pollId }).populate("scholarId", "name upMail");
    }

    async getVoteByScholar(pollId, scholarId) {
        return await Vote.findOne({ pollId, scholarId });
    }

    async changeVote(pollId, scholarId, newSelectedOption) {
        // Delete the existing vote
        const deleted = await Vote.findOneAndDelete({ pollId, scholarId });

        if (!deleted) {
            const error = new Error("No existing vote found to change");
            error.statusCode = 404;
            throw error;
        }

        // Create the new vote
        const newVote = await Vote.create({
            pollId,
            scholarId,
            selectedOption: newSelectedOption,
        });

        return newVote;
    }
}

module.exports = new VoteService();