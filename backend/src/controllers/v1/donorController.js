const DonorService = require("../../services/v2/donorService");

class DonorController {
    async getDonors(req, res, next) {
        try {
            const data = await DonorService.getAllDonors();
            res.status(200).json({ success: true, count: data.length, data });
        } catch (err) {
            next(err);
        }
    }

    async getDonor(req, res, next) {
        try {
            const data = await DonorService.getDonorById(req.params.id);
            if (!data) return res.status(404).json({ success: false, message: "Donor not found" });
            res.status(200).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async createDonor(req, res, next) {
        try {
            const data = await DonorService.createDonor(req.body);
            res.status(201).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async updateDonor(req, res, next) {
        try {
            const data = await DonorService.updateDonor(req.params.id, req.body);
            if (!data) return res.status(404).json({ success: false, message: "Donor not found" });
            res.status(200).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    async deleteDonor(req, res, next) {
        try {
            await DonorService.deleteDonor(req.params.id);
            res.status(200).json({ success: true, data: {} });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new DonorController();