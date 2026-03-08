const Donation = require("../Model/Donations");

// Get all donations
exports.getAll = async (req, res) => {
    try {
        const donations = await Donation.find();
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving donations", error });
    }
};

// Get a donation by ID
exports.getById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: "Donation not found" });
        }
        res.status(200).json(donation);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving donation", error });
    }
};

// Create a new donation
exports.create = async (req, res) => {
    try {
        const { donorID, amount, dateReceived, mode, remarks, description, receipt } = req.body;

        if (!donorID || !amount || !mode) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newDonation = new Donation({
            donorID,
            amount,
            dateReceived,
            mode,
            remarks,
            description,
            receipt
        });

        await newDonation.save();
        res.status(201).json({ message: "Donation created successfully", newDonation });
    } catch (error) {
        res.status(400).json({ message: "Error creating donation", error });
    }
};

// Update a donation by ID
exports.update = async (req, res) => {
    try {
        const updatedDonation = await Donation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedDonation) {
            return res.status(404).json({ message: "Donation not found" });
        }

        res.status(200).json({ message: "Donation updated successfully", updatedDonation });
    } catch (error) {
        res.status(400).json({ message: "Error updating donation", error });
    }
};

// Delete a donation by ID
exports.delete = async (req, res) => {
    try {
        const deletedDonation = await Donation.findByIdAndDelete(req.params.id);

        if (!deletedDonation) {
            return res.status(404).json({ message: "Donation not found" });
        }

        res.status(200).json({ message: "Donation deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting donation", error });
    }
};
