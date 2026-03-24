const Donor = require("../../models/v1/Donor");
const Transaction = require("../../models/v2/Transaction");

class DonorService {
  async getAllDonors() {
      const donors = await Donor.find().sort({ name: 1 });

      // Compute total donations for each donor
      const donorsWithTotals = await Promise.all(
          donors.map(async (donor) => {
              const total = await Transaction.aggregate([
                  {
                      $match: {
                          type: "donation",
                          "donorInfo.donorId": donor._id,
                      },
                  },
                  {
                      $group: {
                          _id: null,
                          total: { $sum: "$amount" },
                      },
                  },
              ]);

              return {
                  ...donor.toObject(),
                  totalDonations: total.length > 0 ? total[0].total : 0,
              };
          })
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
    if (!donor) throw new Error("Donor not found");
    return donor;
  }
}

module.exports = new DonorService();
