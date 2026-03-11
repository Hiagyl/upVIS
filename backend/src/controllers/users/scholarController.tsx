import { Request, Response } from "express";
import Scholar from "../../models/users/scholars";

// Get all scholars
export const getAll = async (req: Request, res: Response) => {
    try {
        const scholars = await Scholar.find();
        res.status(200).json(scholars);
    } catch (error) {
        res.status(500).json({ message: "Error fetching scholars", error });
    }
};

// Get scholar by ID
export const getById = async (req: Request, res: Response) => {
    try {
        const scholar = await Scholar.findById(req.params.id);
        if (!scholar) {
            return res.status(404).json({ message: "Scholar not found" });
        }
        res.status(200).json(scholar);
    } catch (error) {
        res.status(500).json({ message: "Error fetching scholar", error });
    }
};

// Get scholar by student ID
export const getByStudentId = async (req: Request, res: Response) => {
    try {
        const scholar = await Scholar.findOne({ studentID: req.params.studentID });
        if (!scholar) {
            return res.status(404).json({ message: "Scholar not found" });
        }
        res.status(200).json(scholar);
    } catch (error) {
        res.status(500).json({ message: "Error fetching scholar", error });
    }
};

// Create new scholar
export const create = async (req: Request, res: Response) => {
    try {
        const {
            studentID,
            surname,
            firstname,
            middlename,
            picture,
            status,
            degreeProgram,
            yearLevel,
            contactNo,
        } = req.body;

// Check if student ID already exists
        const existingScholar = await Scholar.findOne({ studentID });
        if (existingScholar) {
            return res.status(400).json({ message: "Student ID already exists" });
        }

        const newScholar = new Scholar({
            studentID,
            surname,
            firstname,
            middlename,
            picture,
            status,
            degreeProgram,
            yearLevel,
            contactNo,
        });

        const savedScholar = await newScholar.save();
        res.status(201).json(savedScholar);
    } catch (error) {
        res.status(500).json({ message: "Error creating scholar", error });
    }
};

// Update scholar
export const update = async (req: Request, res: Response) => {
    try {
        const {
          studentID,
          surname,
          firstname,
          middlename,
          picture,
          status,
          degreeProgram,
          yearLevel,
          contactNo,
        } = req.body;

// Check if updating studentID and if it already exists for another scholar
        if (studentID) {
            const existingScholar = await Scholar.findOne({
                studentID,
                _id: { $ne: req.params.id },
            });
            if (existingScholar) {
                return res.status(400).json({ message: "Student ID already exists" });
            }
        }

        const updatedScholar = await Scholar.findByIdAndUpdate(
            req.params.id,
            {
                studentID,
                surname,
                firstname,
                middlename,
                picture,
                status,
                degreeProgram,
                yearLevel,
                contactNo,
            },
            { new: true, runValidators: true },
        );

        if (!updatedScholar) {
            return res.status(404).json({ message: "Scholar not found" });
        }

        res.status(200).json(updatedScholar);
    } catch (error) {
        res.status(500).json({ message: "Error updating scholar", error });
    }
};


// Delete scholar
export const remove = async (req: Request, res: Response) => {
    try {
        const deletedScholar = await Scholar.findByIdAndDelete(req.params.id);

        if (!deletedScholar) {
            return res.status(404).json({ message: "Scholar not found" });
        }
        res.status(200).json({ message: "Scholar deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting scholar", error });
  }
};

// Get scholars by status
export const getByStatus = async (req: Request, res: Response) => {
    try {
        const status = req.params.status;
        if (!["active", "graduate", "inactive"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const scholars = await Scholar.find({ status });
        res.status(200).json(scholars);
    } catch (error) {
        res
        .status(500)
        .json({ message: "Error fetching scholars by status", error });
  }
};

// Get scholars by degree program
export const getByProgram = async (req: Request, res: Response) => {
    try {
        const scholars = await Scholar.find({
            degreeProgram: req.params.degreeProgram,
        });
        res.status(200).json(scholars);
    } catch (error) {
        res
        .status(500)
        .json({ message: "Error fetching scholars by program", error });
  }
};

// Get scholars by year level
export const getByYearLevel = async (req: Request, res: Response) => {
    try {
        const yearLevel = parseInt(req.params.yearLevel);
        if (isNaN(yearLevel)) {
            return res.status(400).json({ message: "Invalid year level" });
        }

        const scholars = await Scholar.find({ yearLevel });
        res.status(200).json(scholars);
    } catch (error) {
        res
        .status(500)
        .json({ message: "Error fetching scholars by year level", error });
    }
};
