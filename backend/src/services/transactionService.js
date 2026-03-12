const Transaction = require("../models/Transaction");

class TransactionService {
  async getAllTransactions() {
    return await Transaction.find().sort({ date: -1 });
  }

  async createTransaction(data) {
    return await Transaction.create(data);
  }

  async updateTransaction(id, data) {
    return await Transaction.findByIdAndUpdate(id, data, {
      new: true, // Return the modified document
      runValidators: true,
    });
  }

  async deleteTransaction(id) {
    const transaction = await Transaction.findById(id);
    if (!transaction) throw new Error("Transaction not found");
    return await transaction.deleteOne();
  }
}

module.exports = new TransactionService();
