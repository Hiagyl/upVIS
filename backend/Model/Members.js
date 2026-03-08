const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    memberID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    contactNo: {
        type: String,
        required: true,
        trim: true
    },
    joinDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

const Members = mongoose.model('Member', memberSchema);

module.exports = Members;
