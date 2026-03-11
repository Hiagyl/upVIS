import { Request, Response } from "express";
import Distribution from "../../../models/transactions/type/distributions";
import Scholar from "../../../models/users/scholars";

// Get all distributions
export const getAll = async (req: Request, res: Response) => {
      try {
          const { limit, sort } = req.query;
          let query = Distribution.find().populate("students"); // Populate student details

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

          const distributions = await query;
          res.status(200).json(distributions);
      } catch (error) {
          res.status(500).json({ message: "Error fetching distributions", error });
      }
};

// Get distribution by ID (MongoDB _id)
export const getById = async (req: Request, res: Response) => {
      try {
          const distribution = await Distribution.findById(req.params.id).populate(
              "students",
          );
          if (!distribution) {
              return res.status(404).json({ message: "Distribution not found" });
          }
          res.status(200).json(distribution);
      } catch (error) {
          res.status(500).json({ message: "Error fetching distribution", error });
      }
};

// Get distribution by custom transactionID
export const getByTransactionId = async (req: Request, res: Response) => {
    try {
        const distribution = await Distribution.findOne({
        transactionID: req.params.transactionID,
        }).populate("students");

        if (!distribution) {
            return res.status(404).json({ message: "Distribution not found" });
        }
        res.status(200).json(distribution);
    } catch (error) {
        res.status(500).json({ message: "Error fetching distribution", error });
  }
};

// Get distributions by student ID
export const getByStudent = async (req: Request, res: Response) => {
    try {
        const studentId = parseInt(req.params.studentId);

        const distributions = await Distribution.find({
            students: studentId,
        })
            .populate("students")
            .sort({ date: -1 });

            res.status(200).json(distributions);
    } catch (error) {
        res
          .status(500)
          .json({ message: "Error fetching distributions for student", error });
    }
};

// Get distributions by date range
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

        const distributions = await Distribution.find({
            date: {
                $gte: start,
                $lte: end,
            },
        })
            .populate("students")
            .sort({ date: -1 });

        res.status(200).json(distributions);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching distributions by date range", error });
    }
};

// Create new distribution
export const create = async (req: Request, res: Response) => {
    try {
        const { transactionID, amount, description, date, students } = req.body;

        // Check if transactionID already exists
        const existing = await Distribution.findOne({ transactionID });
        if (existing) {
            return res.status(400).json({ message: "Transaction ID already exists" });
        }

        // Validate amount
        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0" });
        }

      // Validate students array
        if (!students || !Array.isArray(students) || students.length === 0) {
            return res
                .status(400)
                .json({ message: "At least one student is required" });
        }

      // Verify all students exist
        const validStudents = await Scholar.find({
            studentID: { $in: students },
        });

        if (validStudents.length !== students.length) {
            return res.status(400).json({
                message: "One or more student IDs are invalid",
            });
        }

        // Calculate per-student amount
        const perStudentAmount = amount / students.length;

        const newDistribution = new Distribution({
            transactionID,
            amount,
            description,
            transactionType: "distribution",
            date: date || Date.now(),
            students,
        });

        const savedDistribution = await newDistribution.save();

        // Populate student details before returning
        await savedDistribution.populate("students");

        res.status(201).json({
            ...savedDistribution.toObject(),
            perStudentAmount, // Add calculated field
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating distribution", error });
    }
};

// Update distribution
export const update = async (req: Request, res: Response) => {
    try {
        const { transactionID, amount, description, date, students } = req.body;

        // Check if updating transactionID and if it already exists
        if (transactionID) {
            const existing = await Distribution.findOne({
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

      // Validate students if provided
        if (students) {
            if (!Array.isArray(students) || students.length === 0) {
                return res
                  .status(400)
                  .json({ message: "At least one student is required" });
            }

            const validStudents = await Scholar.find({
                studentID: { $in: students },
            });

            if (validStudents.length !== students.length) {
                return res.status(400).json({
                    message: "One or more student IDs are invalid",
                });
            }
        }

        const updatedDistribution = await Distribution.findByIdAndUpdate(
            req.params.id,
            {
                transactionID,
                amount,
                description,
                transactionType: "distribution", // Keep as distribution
                date,
                students,
            },
            { new: true, runValidators: true },
        ).populate("students");

        if (!updatedDistribution) {
            return res.status(404).json({ message: "Distribution not found" });
        }

        // Calculate per-student amount for response
        const perStudentAmount =
            updatedDistribution.amount / updatedDistribution.students.length;

        res.status(200).json({
            ...updatedDistribution.toObject(),
            perStudentAmount,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating distribution", error });
    }
};


// Delete distribution
export const remove = async (req: Request, res: Response) => {
    try {
        const deletedDistribution = await Distribution.findByIdAndDelete(
            req.params.id,
        );

        if (!deletedDistribution) {
            return res.status(404).json({ message: "Distribution not found" });
        }

        res.status(200).json({ message: "Distribution deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting distribution", error });
    }
};
// Get distribution summary/stats - SIMPLE VERSION
export const getSummary = async (req: Request, res: Response) => {
    try {
        const { year, month } = req.query;

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

        const stats = await Distribution.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: null,
                    totalDistributed: { $sum: "$amount" },
                    totalTransactions: { $sum: 1 },
                    averageAmount: { $avg: "$amount" },
                    minAmount: { $min: "$amount" },
                    maxAmount: { $max: "$amount" },
                },
            },
        ]);

        const result = stats[0] || {
            totalDistributed: 0,
            totalTransactions: 0,
            averageAmount: 0,
            minAmount: 0,
            maxAmount: 0,
        };

        res.status(200).json({
            ...result,
            filters: {
                year: year || "all",
                month: month || "all",
            },
        });
    } catch (error) {
      res.status(500).json({ message: "Error generating distribution summary", error });
    }

};
