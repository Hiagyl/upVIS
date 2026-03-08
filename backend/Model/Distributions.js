const mongoose = require("mongoose");

const DistributionSchema = new mongoose.Schema({
  distributionID: {
    type: String,
    required: true,
    unique: true
  },
  scholar: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    default: ""
  },
  proof: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Distribution", DistributionSchema);
