import { Request, Response } from "express";
import Members from "../../models/users/members";

// Get all members
export const getAll = async (req: Request, res: Response) => {
    try {
        const members = await Members.find().sort({ joinDate: -1 });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Error fetching members", error });
    }
};

// Get member by ID
export const getById = async (req: Request, res: Response) => {
      try {
          const member = await Members.findById(req.params.id);
          if (!member) {
              return res.status(404).json({ message: "Member not found" });
          }
          res.status(200).json(member);
      } catch (error) {
          res.status(500).json({ message: "Error fetching member", error });
      }
};

// Get member by custom memberID
export const getByMemberId = async (req: Request, res: Response) => {
    try {
        const member = await Members.findOne({ memberID: req.params.memberID });
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: "Error fetching member", error });
    }
};

// Get members by status
export const getByStatus = async (req: Request, res: Response) => {
    try {
        const status = req.params.status;
        if (!["active", "inactive"].includes(status)) {
            return res
            .status(400)
            .json({ message: 'Invalid status value. Use "active" or "inactive"' });
        }

        const members = await Members.find({ status }).sort({ joinDate: -1 });
            res.status(200).json(members);
    } catch (error) {
        res
        .status(500)
        .json({ message: "Error fetching members by status", error });
  }
};

// Create new member
export const create = async (req: Request, res: Response) => {
    try {
        const {
            memberID,
            surname,
            firstname,
            middlename,
            picture,
            contactNo,
            joinDate,
            status,
        } = req.body;

// Check if memberID already exists
        const existingMember = await Members.findOne({ memberID });
        if (existingMember) {
            return res.status(400).json({ message: "Member ID already exists" });
        }

        const newMember = new Members({
            memberID,
            surname,
            firstname,
            middlename,
            picture,
            contactNo,
            joinDate: joinDate || Date.now(),
            status: status || "active",
        });

        const savedMember = await newMember.save();
            res.status(201).json(savedMember);
    } catch (error) {
        res.status(500).json({ message: "Error creating member", error });
  }
};

// Update member
export const update = async (req: Request, res: Response) => {
    try {
        const {
            memberID,
            surname,
            firstname,
          middlename,
          picture,
          contactNo,
          joinDate,
          status,
        } = req.body;

// Check if updating memberID and if it already exists for another member
        if (memberID) {
            const existingMember = await Members.findOne({
            memberID,
            _id: { $ne: req.params.id },
            });
            if (existingMember) {
                return res.status(400).json({ message: "Member ID already exists" });
            }
        }

        const updatedMember = await Members.findByIdAndUpdate(
            req.params.id,
            {
               memberID,
                surname,
                firstname,
                middlename,
                picture,
                contactNo,
                joinDate,
                status,
            },
            { new: true, runValidators: true },
        );

        if (!updatedMember) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.status(200).json(updatedMember);
    } catch (error) {
        res.status(500).json({ message: "Error updating member", error });
    }
};

// Delete member
export const remove = async (req: Request, res: Response) => {
    try {
        const deletedMember = await Members.findByIdAndDelete(req.params.id);

        if (!deletedMember) {
          return res.status(404).json({ message: "Member not found" });
        }

        res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting member", error });
    }
};
