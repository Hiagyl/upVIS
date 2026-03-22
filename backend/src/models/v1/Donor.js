const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a donor name"],
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email",
            ],
        },
        phone: {
            type: String,
            maxlength: [20, "Phone number cannot be longer than 20 characters"],
        },
        address: {
            type: String,
        },
        donorType: {
            type: String,
            enum: ["individual", "corporate", "organization"],
            default: "individual",
        },
        notes: {
            type: String,
            maxlength: [500, "Notes cannot be more than 500 characters"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Donor", DonorSchema);