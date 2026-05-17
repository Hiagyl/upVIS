const Transaction = require("../../models/v2/Transaction"); // Ensure this matches your filename

class TransactionService {
  /**
   * Fetch all transactions sorted by date descending
   */
  async getAllTransactions(query = {}, skip = 0, limit = 10) {
    return await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countTransactions(query = {}) {
    return await Transaction.countDocuments(query);
  }

  async createTransaction(data) {
    return await Transaction.create(data);
  }

  async updateTransaction(id, data) {
    return await Transaction.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteTransaction(id) {
    const deletedDoc = await Transaction.findByIdAndDelete(id);

    if (!deletedDoc) {
      throw new Error("Transaction not found");
    }

    return deletedDoc;
  }

  async getTotalDonationsByDonor(email) {
    const donations = await Transaction.find({
      type: "donation",
      "donorInfo.email": email,
    });

    return donations.reduce(
      (sum, donation) => sum + Number(donation.amount || 0),
      0,
    );
  }
}

module.exports = new TransactionService();
