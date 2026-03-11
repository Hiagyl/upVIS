import { Request, Response } from "express";
import Donors from "../../models/users/donors";

// Get all donors
export const getAll = async (req: Request, res: Response) => {
    try {
        const donors = await Donors.find().sort({ joinDate: -1 });
        res.status(200).json(donors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donors", error });
    }
};

// Get donor by ID
export const getById = async (req: Request, res: Response) => {
    try {
        const donor = await Donors.findById(req.params.id);
        if (!donor) {
          return res.status(404).json({ message: "Donor not found" });
        }
        res.status(200).json(donor);
    } catch (error) {
    res.status(500).json({ message: "Error fetching donor", error });
    }
};

// Get donor by custom donorID
export const getByDonorId = async (req: Request, res: Response) => {
    try {
        const donor = await Donors.findOne({ donorID: req.params.donorID });
        if (!donor) {
            return res.status(404).json({ message: "Donor not found" });
        }
        res.status(200).json(donor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donor", error });
    }
};

// Create new donor
export const create = async (req: Request, res: Response) => {
    try {
        const {
            donorID,
            surname,
            firstname,
            middlename,
            picture,
            contactNo,
            joinDate,
        } = req.body;

// Check if donorID already exists
        const existingDonor = await Donors.findOne({ donorID });
        if (existingDonor) {
            return res.status(400).json({ message: "Donor ID already exists" });
        }

        const newDonor = new Donors({
            donorID,
            surname,
            firstname,
            middlename,
            picture,
            contactNo,
            joinDate: joinDate || Date.now(),
        });

        const savedDonor = await newDonor.save();
        res.status(201).json(savedDonor);
    } catch (error) {
        res.status(500).json({ message: "Error creating donor", error });
    }
};

// Update donor
export const update = async (req: Request, res: Response) => {
      try {
          const {
          donorID,
          surname,
          firstname,
          middlename,
          picture,
          contactNo,
          joinDate,
          } = req.body;

// Check if updating donorID and if it already exists for another donor
    if (donorID) {
        const existingDonor = await Donors.findOne({
            donorID,
            _id: { $ne: req.params.id },
        });
        if (existingDonor) {
            return res.status(400).json({ message: "Donor ID already exists" });
        }
    }

    const updatedDonor = await Donors.findByIdAndUpdate(
        req.params.id,
        {
            donorID,
            surname,
            firstname,
            middlename,
            picture,
            contactNo,
            joinDate,
        },
        { new: true, runValidators: true },
    );

        if (!updatedDonor) {
            return res.status(404).json({ message: "Donor not found" });
        }

        res.status(200).json(updatedDonor);
    } catch (error) {
        res.status(500).json({ message: "Error updating donor", error });
    }
};

// Delete donor
export const remove = async (req: Request, res: Response) => {
    try {
        const deletedDonor = await Donors.findByIdAndDelete(req.params.id);

        if (!deletedDonor) {
          return res.status(404).json({ message: "Donor not found" });
        }

        res.status(200).json({ message: "Donor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting donor", error });
    }
};
