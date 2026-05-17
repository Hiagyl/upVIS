const TransactionService = require("../../services/v1/transactionService");

class TransactionController {
  async getTransactions(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const search = req.query.search || "";
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;

      const query = {};

      // SEARCH
      if (search) {
        query.$or = [
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { "donorInfo.name": { $regex: search, $options: "i" } },
        ];
      }

      // DATE FILTER
      if (startDate || endDate) {
        query.date = {};

        if (startDate) {
          query.date.$gte = new Date(startDate);
        }

        if (endDate) {
          query.date.$lte = new Date(endDate);
        }
      }

      // GET TRANSACTIONS
      const transactions = await TransactionService.getAllTransactions(
        query,
        skip,
        limit,
      );

      // TOTAL COUNT
      const totalTransactions =
        await TransactionService.countTransactions(query);

      const totalPages = Math.ceil(totalTransactions / limit);

      // SUMMARY
      const allTransactions =
        await TransactionService.getAllTransactions(query);

      const totalDonations = allTransactions
        .filter((t) => t.type === "donation")
        .reduce((acc, item) => acc + item.amount, 0);

      const totalExpenses = allTransactions
        .filter((t) => t.type === "expense")
        .reduce((acc, item) => acc + item.amount, 0);

      res.status(200).json({
        success: true,
        data: transactions,
        currentPage: page,
        totalPages,
        totalTransactions,
        summary: {
          totalDonations,
          totalExpenses,
          balance: totalDonations - totalExpenses,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // ... rest of your methods (create, update, delete) stay the same
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
