const Poll = require("../../models/v1/Poll");
const Vote = require("../../models/v1/Vote");

class PollService {
    async getAllPolls() {
        return await Poll.find().sort({ createdAt: -1 });
    }

    async getPollById(id) {
        return await Poll.findById(id);
    }

    async createPoll(data, adminId) {
        return await Poll.create({
            ...data,
            createdBy: adminId
        });
    }

    async updatePoll(id, data, adminId) {
        const poll = await Poll.findById(id);
        if (!poll) throw new Error("Poll not found");
        if (poll.createdBy.toString() !== adminId.toString())
            throw new Error("Unauthorized: only the admin who created this poll can edit it");

        return await Poll.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
    }

    async closePoll(id, adminId) {
        const poll = await Poll.findById(id);
        if (!poll) throw new Error("Poll not found");
        if (poll.createdBy.toString() !== adminId.toString())
            throw new Error("Unauthorized: only the admin who created this poll can close it");

        return await Poll.findByIdAndUpdate(id, { status: "closed" }, { new: true });
    }

    async deletePoll(id, adminId) {
        const poll = await Poll.findById(id);
        if (!poll) throw new Error("Poll not found");
        if (poll.createdBy.toString() !== adminId.toString())
            throw new Error("Unauthorized: only the admin who created this poll can delete it");

        await Vote.deleteMany({ pollId: id });
        return await Poll.findByIdAndDelete(id);
    }

    async getPollResults(id) {
        const poll = await Poll.findById(id);
        if (!poll) throw new Error("Poll not found");

        // Tally votes per option
        const tally = {};
        poll.options.forEach(option => tally[option] = 0);

        const votes = await Vote.find({ pollId: id });
        votes.forEach(vote => {
            if (tally[vote.selectedOption] !== undefined) {
                tally[vote.selectedOption]++;
            }
        });

        return {
            poll,
            totalVotes: votes.length,
            results: tally
        };
    }
}

module.exports = new PollService();