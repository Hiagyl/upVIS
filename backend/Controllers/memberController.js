const Member = require("../Model/Members");

//Get all members
exports.getAll = async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving members", error });
    }
};

//Get member by ID
exports.getById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving member", error });
    }
};

//Create a new member
exports.create = async (req, res) => {
    try {
        const { memberID, fullname, contactNo, joinDate, status } = req.body;

        if (!memberID || !fullname || !contactNo) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existing = await Member.findOne({ memberID });
        if (existing) {
            return res.status(400).json({ message: "Member ID already exists" });
        }

        const newMember = new Member({
            memberID,
            fullname,
            contactNo,
            joinDate,
            status
        });

        await newMember.save();
        res.status(201).json({ message: "Member created successfully", newMember });
    } catch (error) {
        res.status(400).json({ message: "Error creating member", error });
    }
};

//Update member by ID
exports.update = async (req, res) => {
    try {
        const updatedMember = await Member.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedMember) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.status(200).json({ message: "Member updated successfully", updatedMember });
    } catch (error) {
        res.status(400).json({ message: "Error updating member", error });
    }
};

//Delete member by ID
exports.delete = async (req, res) => {
    try {
        const deletedMember = await Member.findByIdAndDelete(req.params.id);

        if (!deletedMember) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting member", error });
    }
};
