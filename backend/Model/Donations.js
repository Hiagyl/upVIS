const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    donorID: {
        type: String,
        required: true,
        ref: 'Donors'
    },
    amount: {
        type: Number,
        required: true
    },
    dateReceived: {
        type: Date,
        default: Date.now
    },
    mode: {
        type: String, // e.g. "cash", "bank transfer", "gcash", etc.
        required: true
    },
    remarks: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    receipt: {
        type: String, // URL or file path of the receipt image
        default: ''
    }
});

const Donations = mongoose.model('Donation', DonationSchema);
module.exports = Donations;
