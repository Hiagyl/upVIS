const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Poll title is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    options: {
        type: [String],
        required: [true, "Poll options are required"],
        validate: {
            validator: (arr) => arr.length >= 2,
            message: "A poll must have at least 2 options"
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: [true, "Poll creator is required"]
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"]
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"]
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    }
}, { timestamps: true });

module.exports = mongoose.models.Poll || mongoose.model("Poll", pollSchema);