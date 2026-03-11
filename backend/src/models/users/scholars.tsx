import mongoose, { Schema, Document } from "mongoose";

export interface IScholar extends Document {
    studentID: number;
    surname: string;
    firstname: string;
    middlename?: string;
    picture?: string;
    status: "active" | "graduate" | "inactive";
    degreeProgram: string;
    yearLevel: number;
    contactNo: string;
    dateAdded?: Date;
}

// Create the schema
const ScholarSchema: Schema = new Schema({
    studentID: {
        type: Number,
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
        default: "",
    },
    status: {
        type: String,
        enum: ["active", "graduate", "inactive"],
        default: "active",
    },
    degreeProgram: {
        type: String,
        required: true,
    },
    yearLevel: {
        type: Number,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});
const Scholars= mongoose.model<IScholar>("Scholar", ScholarSchema)
export default Scholars;