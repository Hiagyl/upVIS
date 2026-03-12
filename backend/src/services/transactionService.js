const Transaction = require("../models/Transaction"); // Ensure this matches your filename

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
}

module.exports = new TransactionService();
