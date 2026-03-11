import { Request, Response } from "express";
import Expense from "../../../models/transactions/type/expenses";
import Member from "../../../models/users//members";

// Get all expenses
export const getAll = async (req: Request, res: Response) => {
  try {
    const { limit, sort } = req.query;
    let query = Expense.find().populate("memberID"); // Populate member details

    // Apply sorting (default: newest first)
    if (sort === "asc") {
      query = query.sort({ date: 1 });
    } else {
      query = query.sort({ date: -1 });
    }

    // Apply limit if provided
    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const expenses = await query;
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

// Get expense by ID (MongoDB _id)
export const getById = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id).populate("memberID");
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expense", error });
  }
};

// Get expense by custom transactionID
export const getByTransactionId = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findOne({
      transactionID: req.params.transactionID,
    }).populate("memberID");

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expense", error });
  }
};

// Get expenses by member ID
export const getByMember = async (req: Request, res: Response) => {
  try {
    const memberID = req.params.memberID;

    const expenses = await Expense.find({ memberID })
      .populate("memberID")
      .sort({ date: -1 });

    // Get member total
    const total = await Expense.aggregate([
      { $match: { memberID } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      expenses,
      memberTotal: total[0]?.totalAmount || 0,
      count: expenses.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching expenses for member", error });
  }
};

// Get expenses by date range
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
    end.setHours(23, 59, 59, 999);

    const expenses = await Expense.find({
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .populate("memberID")
      .sort({ date: -1 });

    // Get total for date range
    const total = await Expense.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      expenses,
      periodTotal: total[0]?.totalAmount || 0,
      count: expenses.length,
      dateRange: { start, end },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching expenses by date range", error });
  }
};

// Create new expense
export const create = async (req: Request, res: Response) => {
  try {
    const {
      transactionID,
      amount,
      description,
      date,
      memberID,
      receipt,
      remarks,
    } = req.body;

    // Check if transactionID already exists
    const existing = await Expense.findOne({ transactionID });
    if (existing) {
      return res.status(400).json({ message: "Transaction ID already exists" });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    // Verify member exists
    const member = await Member.findOne({ memberID });
    if (!member) {
      return res.status(400).json({ message: "Member not found" });
    }

    const newExpense = new Expense({
      transactionID,
      amount,
      description,
      transactionType: "expense",
      date: date || Date.now(),
      memberID,
      receipt,
      remarks,
    });

    const savedExpense = await newExpense.save();

    // Populate member details before returning
    await savedExpense.populate("memberID");

    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: "Error creating expense", error });
  }
};

// Update expense (full update)
export const update = async (req: Request, res: Response) => {
  try {
    const {
      transactionID,
      amount,
      description,
      date,
      memberID,
      receipt,
      remarks,
    } = req.body;

    // Check if updating transactionID and if it already exists
    if (transactionID) {
      const existing = await Expense.findOne({
        transactionID,
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Transaction ID already exists" });
      }
    }

    // Validate amount if provided
    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    // Verify member exists if provided
    if (memberID) {
      const member = await Member.findOne({ memberID });
      if (!member) {
        return res.status(400).json({ message: "Member not found" });
      }
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        transactionID,
        amount,
        description,
        transactionType: "expense",
        date,
        memberID,
        receipt,
        remarks,
      },
      { new: true, runValidators: true },
    ).populate("memberID");

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
};



// Delete expense
export const remove = async (req: Request, res: Response) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
};

// Get expense summary/stats
export const getSummary = async (req: Request, res: Response) => {
  try {
    const { year, month, memberID } = req.query;

    let matchFilter: any = {};

    // Date filtering
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
      matchFilter.date = { $gte: startDate, $lte: endDate };
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
      matchFilter.date = { $gte: startDate, $lte: endDate };
    }

    // Member filtering
    if (memberID) {
      matchFilter.memberID = memberID;
    }

    const summary = await Expense.aggregate([
      { $match: matchFilter },
      {
        $facet: {
          // Overall stats
          overall: [
            {
              $group: {
                _id: null,
                totalExpenses: { $sum: "$amount" },
                totalTransactions: { $sum: 1 },
                averageAmount: { $avg: "$amount" },
                minAmount: { $min: "$amount" },
                maxAmount: { $max: "$amount" },
              },
            },
          ],
          // Stats by month
          byMonth: [
            {
              $group: {
                _id: { $month: "$date" },
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          // Top members (who requested expenses)
          topMembers: [
            {
              $group: {
                _id: "$memberID",
                totalAmount: { $sum: "$amount" },
                timesRequested: { $sum: 1 },
              },
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "members",
                localField: "_id",
                foreignField: "memberID",
                as: "memberInfo",
              },
            },
            { $unwind: "$memberInfo" },
          ],
        },
      },
    ]);

    const result = summary[0] || {};

    res.status(200).json({
      summary: {
        totalExpenses: result.overall[0]?.totalExpenses || 0,
        totalTransactions: result.overall[0]?.totalTransactions || 0,
        averageAmount: result.overall[0]?.averageAmount || 0,
        minAmount: result.overall[0]?.minAmount || 0,
        maxAmount: result.overall[0]?.maxAmount || 0,
      },
      byMonth: result.byMonth || [],
      topMembers: result.topMembers || [],
      filters: {
        year: year || "all",
        month: month || "all",
        memberID: memberID || "all",
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating expense summary", error });
  }
};
