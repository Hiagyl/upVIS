const mongoose = require('mongoose');

const scholarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Scholar name is required'],
        trim: true
    },
    studentNumber: {
        type: String,
        required: [true, 'Student number is required'],
        unique: true,
        trim: true
    },
    program: {
        type: String,
        required: [true, 'Academic program is required'],
        trim: true
    },
    upMail: {
        type: String,
        required: [true, 'UP Mail is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@up.edu.ph$/, 'Please use a valid @up.edu.ph email']
    },
    contactNo: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    scholarshipStartDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        default: null
    },
    status: {
        type: String,
        enum: ['Student', 'Graduated'],
        default: 'Student'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.models.Scholar || mongoose.model('Scholar', scholarSchema);
