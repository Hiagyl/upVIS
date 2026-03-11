import { Request, Response } from "express";
import Transactions from "../../models/transactions/transactions";

// Get all transactions
export const getAll = async (req: Request, res: Response) => {
    try {
        const { limit, sort } = req.query;
        let query = Transactions.find();

        // Apply sorting (default: newest first)
        if (sort === "asc") {
            query = query.sort({ date: 1 });
        } else {
            query = query.sort({ date: -1 }); // descending (newest first)
        }

        // Apply limit if provided
        if (limit) {
            query = query.limit(parseInt(limit as string));
        }

        const transactions = await query;
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error });
    }
};

// Get transaction by ID (MongoDB _id)
export const getById = async (req: Request, res: Response) => {
    try {
        const transaction = await Transactions.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction", error });
    }
};

// Get transaction by custom transactionID
export const getByTransactionId = async (req: Request, res: Response) => {
    try {
        const transaction = await Transactions.findOne({
            transactionID: req.params.transactionID,
        });
            if (!transaction) {
                return res.status(404).json({ message: "Transaction not found" });
            }
            res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction", error });
    }
};

// Get transactions by type
export const getByType = async (req: Request, res: Response) => {
    try {
        const transactionType = req.params.transactionType;
        if (!["donation", "expense", "distribution"].includes(transactionType)) {
            return res
                .status(400)
                .json({
                    message:
                      "Invalid transaction type. Use: donation, expense, or distribution",
                });
        }

        const transactions = await Transactions.find({ transactionType }).sort({
            date: -1,
        });
        res.status(200).json(transactions);
    } catch (error) {
        res
        .status(500)
        .json({ message: "Error fetching transactions by type", error });
    }
};

// Get transactions by date range
export const getByDateRange = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res
            .status(400)
            .json({ message: "Please provide both startDate and endDate" });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        // Set end date to end of day
        end.setHours(23, 59, 59, 999);

        const transactions = await Transactions.find({
            date: {
            $gte: start,
            $lte: end,
            },
        }).sort({ date: -1 });

        res.status(200).json(transactions);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching transactions by date range", error });
    }
};

// Get transaction summary/stats
export const getSummary = async (req: Request, res: Response) => {
    try {
        const { year, month } = req.query;

        let dateFilter = {};

        if (year && month) {
            const startDate = new Date(
            parseInt(year as string),
            parseInt(month as string) - 1,
            1,
            );
            const endDate = new Date(
                parseInt(year as string),
                parseInt(month as string),
                0,
              23,
              59,
              59,
              999,
            );
            dateFilter = { date: { $gte: startDate, $lte: endDate } };
        } else if (year) {
            const startDate = new Date(parseInt(year as string), 0, 1);
            const endDate = new Date(
            parseInt(year as string),
                11,
              31,
              23,
              59,
              59,
              999,
            );
            dateFilter = { date: { $gte: startDate, $lte: endDate } };
        }

        const summary = await Transactions.aggregate([
        { $match: dateFilter },
        {
            $group: {
                _id: "$transactionType",
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 },
                averageAmount: { $avg: "$amount" },
                minAmount: { $min: "$amount" },
                maxAmount: { $max: "$amount" },
            },
        },
        {
            $project: {
                transactionType: "$_id",
                totalAmount: 1,
                count: 1,
                averageAmount: { $round: ["$averageAmount", 2] },
                minAmount: 1,
                maxAmount: 1,
                _id: 0,
            },
      },
    ]);

    // Calculate totals
        const totalDonations =
            summary.find((s) => s.transactionType === "donation")?.totalAmount || 0;
        const totalExpenses =
            summary.find((s) => s.transactionType === "expense")?.totalAmount || 0;
        const totalDistributions =
            summary.find((s) => s.transactionType === "distribution")?.totalAmount ||
            0;

        const netBalance = totalDonations - (totalExpenses + totalDistributions);

        res.status(200).json({
            byType: summary,
            totals: {
            totalDonations,
            totalExpenses,
            totalDistributions,
            netBalance,
            totalTransactions: summary.reduce((acc, curr) => acc + curr.count, 0),
            },
          dateRange: dateFilter,
        });
    } catch (error) {
        res
          .status(500)
          .json({ message: "Error generating transaction summary", error });
    }
};

// Create new transaction
export const create = async (req: Request, res: Response) => {
    try {
        const { transactionID, amount, description, transactionType, date } =
        req.body;

    // Check if transactionID already exists
        const existingTransaction = await Transactions.findOne({ transactionID });
        if (existingTransaction) {
            return res.status(400).json({ message: "Transaction ID already exists" });
        }

    // Validate amount is positive
        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0" });
        }

        const newTransaction = new Transactions({
            transactionID,
            amount,
            description,
            transactionType,
            date: date || Date.now(),
        });

        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(500).json({ message: "Error creating transaction", error });
    }
};

// Update transaction
export const update = async (req: Request, res: Response) => {
    try {
        const { transactionID, amount, description, transactionType, date } = req.body;

    // Check if updating transactionID and if it already exists for another transaction
        if (transactionID) {
            const existingTransaction = await Transactions.findOne({
                transactionID,
                _id: { $ne: req.params.id },
            });
            if (existingTransaction) {
                return res
                  .status(400)
                  .json({ message: "Transaction ID already exists" });
            }
        }

        // Validate amount is positive if provided
        if (amount !== undefined && amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0" });
        }

        const updatedTransaction = await Transactions.findByIdAndUpdate(
            req.params.id,
            {
            transactionID,
            amount,
            description,
            transactionType,
            date,
            },
            { new: true, runValidators: true },
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: "Error updating transaction", error });
    }
};


// Delete transaction
export const remove = async (req: Request, res: Response) => {
    try {
        const deletedTransaction = await Transactions.findByIdAndDelete(req.params.id,);

        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error });
    }
};
