import mongoose, { Schema, Document} from 'mongoose';

interface IMember extends Document {
    memberID: string;
    surname: string;
    firstname: string;
    middlename?: string;
    picture?: string;
    contactNo: string;
    joinDate: Date;
    status: 'active' | 'inactive';
}


// Create the schema
const memberSchema = new Schema<IMember>({
    memberID: {
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
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

// Create and export the model
const Members = mongoose.model<IMember>('Member', memberSchema);

export default Members;