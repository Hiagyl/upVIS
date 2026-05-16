const Transaction = require("../../models/v2/Transaction"); // Ensure this matches your filename

class TransactionService {
  /**
   * Fetch all transactions sorted by date descending
   */
  async getAllTransactions() {
    return await Transaction.find().sort({ date: -1 });
  }

  /**
   * Create a new donation or expense
   */
  async createTransaction(data) {
    return await Transaction.create(data);
  }

  /**
   * Update an existing transaction by ID
   */
  async updateTransaction(id, data) {
    return await Transaction.findByIdAndUpdate(id, data, {
      new: true, // Returns the updated document instead of the old one
      runValidators: true, // Ensures the update follows your Schema rules
    });
  }

  /**
   * Delete a transaction
   */
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
