const Donor = require("../../models/v1/Donor");
const transactionService = require("../../services/v1/transactionService");

class DonorService {
  async getAllDonors() {
    const donors = await Donor.find();

    const donorsWithTotals = await Promise.all(
      donors.map(async (donor) => {
        const totalDonations =
          await transactionService.getTotalDonationsByDonor(donor.email);

        return {
          ...donor.toObject(),
          totalDonations,
        };
      }),
    );

    return donorsWithTotals;
  }

  async getDonorById(id) {
    return await Donor.findById(id);
  }

  async createDonor(data) {
    return await Donor.create(data);
  }

  async updateDonor(id, data) {
    return await Donor.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteDonor(id) {
    const donor = await Donor.findByIdAndDelete(id);

    if (!donor) {
      throw new Error("Donor not found");
    }

    return donor;
  }
}

module.exports = new DonorService();
