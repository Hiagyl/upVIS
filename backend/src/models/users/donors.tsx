import mongoose, { Schema, Document} from 'mongoose';

interface IDonor extends Document {
    donorID: string;
    surname: string;
    firstname: string;
    middlename?: string;
    picture?: string;
    contactNo: string;
    joinDate: Date;
}


// Create the schema
const donorSchema = new Schema<IDonor>({
    donorID: {
        type: String,
        required: true,
        unique: true,
    },
    surname: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    middlename:{
        type: String,
    },
    picture: {
        type: String,
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
});

// Create and export the model
const Donors = mongoose.model<IDonor>('Donor', donorSchema);

export default Donors;