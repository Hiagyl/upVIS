const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    responsibleID: {
        type: String,
        required: true,
        ref: 'Members' 
    },
    receipt: {
        type: String, // store a file path
        default: null
    },
    remarks: {
        type: String,
        trim: true,
        default: ''
    }
});

const Expenses = mongoose.model('Expense', expenseSchema);

module.exports = Expenses;
