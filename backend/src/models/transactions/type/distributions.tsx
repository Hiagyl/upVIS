import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from '../transactions';


export interface IDistributions extends ITransaction {
    students: number[];  // Array of student IDs
}

// Create the schema
const distributionSchema = new Schema<IDistributions>({
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
        default: 'distribution',
        enum: ['distribution']
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    students: [{
        type: Number,  // Array of student IDs as strings
        ref: 'Scholar'  // If you have a Student model
    }]
},{
    timestamps: true
});

// Create and export the model
const Distribution = mongoose.model<IDistributions>('Distribution', distributionSchema);

export default Distribution;