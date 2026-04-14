const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    studentNumber: {
        type: String,
        trim: true,
        default: ""
    },
    program: {
        type: String,
        trim: true,
        default: ""
    },
    role: {
        type: String,
        enum: ['member', 'admin'],
        default: 'member'
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        default: null
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
}, {
    timestamps: true
});

const Members = mongoose.models.Member || mongoose.model('Member', memberSchema);

module.exports = Members;
