import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from './transactions';

// Individual transactions to be sent to scholars when generate distributions
export interface IIndividualDistribution {
    studentID: number;
    transactionID: string;
    description: string;
    status: 'pending' | 'received' | 'cancelled';
    receivedAt?: Date;
    remarks?: string;
}



const individualDistributionSchema = new Schema<IIndividualDistribution>({

    studentID: {
        type: Number,
        required: true,
        ref: 'Scholar',
        index: true
    },
    transactionID: {
        type: String,
        required: true,
        ref: 'Distribution',
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'received', 'cancelled'],
        default: 'pending'
    },
    receivedAt: {
        type: Date
    },
    remarks: {
        type: String,
        trim: true,
    }
}, {
        timestamps: true
    });


const IndividualDistribution = mongoose.model<IIndividualDistribution>('IndividualDistribution', individualDistributionSchema);
export default IndividualDistribution;