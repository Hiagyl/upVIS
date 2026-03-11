import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from './transactions';


export interface IExpenses extends ITransaction {
    memberID: string;            //to check who is responsible
    receipt?: string;            //Picture of receipt etc
    remarks?: string;
}

// Create the schema
const expensesSchema = new Schema<IExpenses>({
    transactionID: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
    },
    transactionType: {
        type: String,
        required: true,
        default: 'expense',
        enum: ['expense']
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    memberID: {
        type: String,
        required: true,
        ref: 'Member'
    },
    receipt: {
        type: String,
    },
    remarks: {
        type: String,
    },
},{
    timestamps: true
});

// Create and export the model
const Expense = mongoose.model<IExpenses>('Expense', expensesSchema);

export default Expense;