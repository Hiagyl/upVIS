const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    reportType: {
        type: String, // e.g. "Monthly", "Quarterly", "Annual"
        required: true
    },
    dateGenerated: {
        type: Date,
        default: Date.now
    },
    totalDonations: {
        type: Number,
        default: 0
    },
    totalExpenses: {
        type: Number,
        default: 0
    },
    netBalance: {
        type: Number,
        default: 0
    }
});

const Reports = mongoose.model('Report', ReportSchema);
module.exports = Reports;
