const Distribution = require("../models/Distributions");

class DistributionController {
    //Get all distributions
    async getDistributions(req, res) {
        try {
            const distributions = await Distribution.find();
            res.status(200).json(distributions);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving distributions", error });
        }
    }

    //Get distribution by ID
    async getDistribution(req, res) {
        try {
            const distribution = await Distribution.findOne({ distributionID: req.params.id });
            if (!distribution) {
                return res.status(404).json({ message: "Distribution not found" });
            }
            res.status(200).json(distribution);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving distribution", error });
        }
    }

    //Create a new distribution
    async createDistribution(req, res) {
        try {
            const { distributionID, scholar, type, amount, location, proof, date } = req.body;

            if (!distributionID || !scholar || !type || !amount) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const existing = await Distribution.findOne({ distributionID });
            if (existing) {
                return res.status(400).json({ message: "Distribution ID already exists" });
            }

            const newDistribution = new Distribution({
                distributionID,
                scholar,
                type,
                amount,
                location,
                proof,
                date
            });

            await newDistribution.save();
            res.status(201).json({ message: "Distribution created successfully", newDistribution });
        } catch (error) {
            res.status(400).json({ message: "Error creating distribution", error });
        }
    }

    //Update distribution by ID
    async updateDistribution(req, res) {
        try {
            const updatedDistribution = await Distribution.findOneAndUpdate(
                { distributionID: req.params.id },
                req.body,
                { new: true, runValidators: true }
            );

            if (!updatedDistribution) {
                return res.status(404).json({ message: "Distribution not found" });
            }

            res.status(200).json({ message: "Distribution updated successfully", updatedDistribution });
        } catch (error) {
            res.status(400).json({ message: "Error updating distribution", error });
        }
    }

    //Delete distribution by ID
    async deleteDistribution(req, res) {
        try {
            const deletedDistribution = await Distribution.findOneAndDelete({ distributionID: req.params.id });

            if (!deletedDistribution) {
                return res.status(404).json({ message: "Distribution not found" });
            }

            res.status(200).json({ message: "Distribution deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting distribution", error });
        }
    }
}

module.exports = new DistributionController();