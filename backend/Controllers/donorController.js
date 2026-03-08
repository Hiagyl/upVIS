const Donor = require("../Model/Donors");

//Get all donors
exports.getAll = async (req, res) => {
    try {
        const donors = await Donor.find();
        res.status(200).json(donors);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving donors", error });
    }
};

//Get donor by ID
exports.getById = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        if (!donor) {
            return res.status(404).json({ message: "Donor not found" });
        }
        res.status(200).json(donor);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving donor", error });
    }
};

//Create a new donor
exports.create = async (req, res) => {
    try {
        const { fullName, contactNo } = req.body;

        // Basic validation
        if (!fullName || !contactNo) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newDonor = new Donor({ fullName, contactNo });
        await newDonor.save();

        res.status(201).json({ message: "Donor created successfully", newDonor });
    } catch (error) {
        res.status(400).json({ message: "Error creating donor", error });
    }
};

//Update donor by ID
exports.update = async (req, res) => {
    try {
        const updatedDonor = await Donor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedDonor) {
            return res.status(404).json({ message: "Donor not found" });
        }

        res.status(200).json({ message: "Donor updated successfully", updatedDonor });
    } catch (error) {
        res.status(400).json({ message: "Error updating donor", error });
    }
};

//Delete donor by ID
exports.delete = async (req, res) => {
    try {
        const deletedDonor = await Donor.findByIdAndDelete(req.params.id);

        if (!deletedDonor) {
            return res.status(404).json({ message: "Donor not found" });
        }

        res.status(200).json({ message: "Donor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting donor", error });
    }
};
