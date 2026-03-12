const Donor = require("../models/Donor");

class DonorService {
  async getAllDonors() {
    return await Donor.find().sort({ name: 1 });
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
