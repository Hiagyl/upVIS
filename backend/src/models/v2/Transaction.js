const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Please add a positive or negative amount"],
    },
    type: {
      type: String,
      enum: ["donation", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: [
        true,
        "Please select a category (e.g., Groceries, Logistics, Incentives)",
      ],
    },
    description: {
      type: String,
      maxlength: [200, "Description cannot be more than 200 characters"],
    },
    donorInfo: {
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donor",
        },
        name: String,
        email: String,
    },
    attachmentUrl: {
      type: String, // URL to receipt image (useful for expenses)
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", TransactionSchema);
