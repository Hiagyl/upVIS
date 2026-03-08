const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    }
});

const Donors = mongoose.model('Donor', DonorSchema);
module.exports = Donors;
