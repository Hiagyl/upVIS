const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll",
        required: [true, "Poll reference is required"]
    },
    scholarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scholar",
        required: [true, "Scholar reference is required"]
    },
    selectedOption: {
        type: String,
        required: [true, "Selected option is required"]
    },
    votedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Ensures a scholar can only vote once per poll
voteSchema.index({ pollId: 1, scholarId: 1 }, { unique: true });

module.exports = mongoose.models.Vote || mongoose.model("Vote", voteSchema);