const Scholar = require("../Model/Scholars");

//Get all scholars
exports.getAll = async (req, res) => {
    try {
        const scholars = await Scholar.find();
        res.status(200).json(scholars);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving scholars", error });
    }
};

//Get scholar by ID
exports.getById = async (req, res) => {
    try {
        const scholar = await Scholar.findById(req.params.id);
        if (!scholar) {
            return res.status(404).json({ message: "Scholar not found" });
        }
        res.status(200).json(scholar);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving scholar", error });
    }
};

//Create a new scholar
exports.create = async (req, res) => {
    try {
        const { scholarID, fullname, picture, status, degreeProgram, yearLevel, contactNo } = req.body;

        if (!scholarID || !fullname || !degreeProgram || !yearLevel || !contactNo) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newScholar = new Scholar({
            scholarID,
            fullname,
            picture,
            status,
            degreeProgram,
            yearLevel,
            contactNo
        });

        await newScholar.save();
        res.status(201).json({ message: "Scholar created successfully", newScholar });
    } catch (error) {
        res.status(400).json({ message: "Error creating scholar", error });
    }
};

//Update scholar by ID
exports.update = async (req, res) => {
    try {
        const updatedScholar = await Scholar.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedScholar) {
            return res.status(404).json({ message: "Scholar not found" });
        }

        res.status(200).json({ message: "Scholar updated successfully", updatedScholar });
    } catch (error) {
        res.status(400).json({ message: "Error updating scholar", error });
    }
};

//Delete scholar by ID
exports.delete = async (req, res) => {
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
