const mongoose = require('mongoose');

const ScholarSchema = new mongoose.Schema({
    scholarID: {
        type: String,
        unique: true,  // ensures no duplicates
    },
    fullname: {
        type: String,
        required: true
    },
    picture: {
        type: String, // URL or file path to the scholar's picture
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'graduate', 'inactive'],
        default: 'active'
    },
    degreeProgram: {
        type: String,
        required: true
    },
    yearLevel: {
        type: Number,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

const Scholars = mongoose.model('Scholar', ScholarSchema);

module.exports = Scholars;