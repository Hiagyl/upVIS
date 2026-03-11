import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from '../transactions';


export interface IDonations extends ITransaction {
    donorID: string;            //for Donor Info
    mode: string;               //Type if Cash Bank Deposit etc
    receipt?: string;            //Picture of deposit etc
    remarks?: string;
}

// Create the schema
const donationSchema = new Schema<IDonations>({
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
        default: 'donation',
        enum: ['donation']
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    donorID: {
        type: String,
        required: true,
        ref: 'Donor',
    },
    mode: {
        type: String,
        enum: ['Cash', 'GCash', 'Paymaya', 'Bank Transfer','Others'],
        required: true
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
const Donation = mongoose.model<IDonations>('Donation', donationSchema);

export default Donation;