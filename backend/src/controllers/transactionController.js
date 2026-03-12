const TransactionService = require("../services/transactionService");

class TransactionController {
  async getTransactions(req, res, next) {
    try {
      const data = await TransactionService.getAllTransactions();
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async createTransaction(req, res, next) {
    try {
      const data = await TransactionService.createTransaction(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async updateTransaction(req, res, next) {
    try {
      const data = await TransactionService.updateTransaction(
        req.params.id,
        req.body,
      );
      if (!data)
        return res.status(404).json({ success: false, message: "Not found" });
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async deleteTransaction(req, res, next) {
    try {
      await TransactionService.deleteTransaction(req.params.id);
      res.status(200).json({ success: true, data: {} });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TransactionController();
