import mongoose, { Schema, Document} from 'mongoose';

//Universal Fields Across Diff type of transaction as well as for main page view
export interface ITransaction extends Document {
    transactionID: string;
    amount: number;
    transactionType: string;
    description: string;
    date: Date;
}

// Create the schema
const transactionSchema = new Schema<ITransaction>({
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
        enum: ['donation', 'expense', 'distribution']
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
},{
    timestamps: true
});

// Create and export the model
const Transactions = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transactions;