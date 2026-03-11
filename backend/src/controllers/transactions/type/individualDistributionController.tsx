import { Request, Response } from "express";
import IndividualDistribution from "../../../models/transactions/type/individualDistributions";
import Scholar from "../../../models/users/scholars";
import Distribution from "../../../models/transactions/type/distributions";

// Get all individual distributions
export const getAll = async (req: Request, res: Response) => {
  try {
    const { limit, status, studentID } = req.query;

    let query: any = {};

    // Apply filters
    if (status) {
      query.status = status;
    }
    if (studentID) {
      query.studentID = parseInt(studentID as string);
    }

    let dbQuery = IndividualDistribution.find(query)
      .populate("studentID")
      .populate("transactionID")
      .sort({ createdAt: -1 });

    if (limit) {
      dbQuery = dbQuery.limit(parseInt(limit as string));
    }

    const distributions = await dbQuery;

    // Get counts by status
    const counts = await IndividualDistribution.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      distributions,
      counts: counts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      total: distributions.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching individual distributions", error });
  }
};

// Get by ID
export const getById = async (req: Request, res: Response) => {
  try {
    const distribution = await IndividualDistribution.findById(req.params.id)
      .populate("studentID")
      .populate("transactionID");

    if (!distribution) {
      return res
        .status(404)
        .json({ message: "Individual distribution not found" });
    }

    res.status(200).json(distribution);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching individual distribution", error });
  }
};

// Get by student ID
export const getByStudent = async (req: Request, res: Response) => {
  try {
    const studentID = parseInt(req.params.studentID);
    const { status } = req.query;

    let query: any = { studentID };
    if (status) {
      query.status = status;
    }

    const distributions = await IndividualDistribution.find(query)
      .populate("studentID")
      .populate("transactionID")
      .sort({ createdAt: -1 });

    // Get student total received
    const totalReceived = await IndividualDistribution.aggregate([
      { $match: { studentID, status: "received" } },
      {
        $lookup: {
          from: "distributions",
          localField: "transactionID",
          foreignField: "transactionID",
          as: "distribution",
        },
      },
      { $unwind: "$distribution" },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$distribution.amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      distributions,
      summary: {
        totalReceived: totalReceived[0]?.totalAmount || 0,
        totalTransactions: totalReceived[0]?.count || 0,
        pending: distributions.filter((d) => d.status === "pending").length,
        received: distributions.filter((d) => d.status === "received").length,
        cancelled: distributions.filter((d) => d.status === "cancelled").length,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching student distributions", error });
  }
};

// Get by distribution transaction ID
export const getByDistribution = async (req: Request, res: Response) => {
  try {
    const transactionID = req.params.transactionID;

    const distributions = await IndividualDistribution.find({ transactionID })
      .populate("studentID")
      .sort({ status: 1, createdAt: -1 });

    // Get summary for this distribution
    const summary = await IndividualDistribution.aggregate([
      { $match: { transactionID } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      distributions,
      summary: summary.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      total: distributions.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching distribution items", error });
  }
};

// Get by status
export const getByStatus = async (req: Request, res: Response) => {
  try {
    const status = req.params.status;

    if (!["pending", "received", "cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Use: pending, received, cancelled",
      });
    }

    const distributions = await IndividualDistribution.find({ status })
      .populate("studentID")
      .populate("transactionID")
      .sort({ createdAt: -1 });

    res.status(200).json(distributions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching distributions by status", error });
  }
};

// Create single individual distribution
export const create = async (req: Request, res: Response) => {
  try {
    const { studentID, transactionID, description, remarks } = req.body;

    // Check if student exists
    const student = await Scholar.findOne({ studentID });
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    // Check if distribution exists
    const distribution = await Distribution.findOne({ transactionID });
    if (!distribution) {
      return res
        .status(400)
        .json({ message: "Distribution transaction not found" });
    }

    // Check if already exists
    const existing = await IndividualDistribution.findOne({
      studentID,
      transactionID,
    });

    if (existing) {
      return res.status(400).json({
        message: "This student already has an entry for this distribution",
      });
    }

    const newDistribution = new IndividualDistribution({
      studentID,
      transactionID,
      description,
      status: "pending",
      remarks,
    });

    const saved = await newDistribution.save();
    await saved.populate(["studentID", "transactionID"]);

    res.status(201).json(saved);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating individual distribution", error });
  }
};

// Create batch of individual distributions
export const createBatch = async (req: Request, res: Response) => {
  try {
    const { distributions } = req.body; // Array of { studentID, transactionID, description, remarks }

    if (!Array.isArray(distributions) || distributions.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide an array of distributions" });
    }

    // Validate all students exist
    const studentIDs = distributions.map((d) => d.studentID);
    const students = await Scholar.find({ studentID: { $in: studentIDs } });

    if (students.length !== studentIDs.length) {
      return res
        .status(400)
        .json({ message: "One or more student IDs are invalid" });
    }

    // Check for duplicates within the batch
    const uniquePairs = new Set();
    const duplicates = [];

    for (const d of distributions) {
      const pair = `${d.studentID}-${d.transactionID}`;
      if (uniquePairs.has(pair)) {
        duplicates.push(pair);
      }
      uniquePairs.add(pair);
    }

    if (duplicates.length > 0) {
      return res.status(400).json({
        message: "Duplicate student-transaction pairs in batch",
        duplicates,
      });
    }

    // Check for existing records
    const existing = await IndividualDistribution.find({
      $or: distributions.map((d) => ({
        studentID: d.studentID,
        transactionID: d.transactionID,
      })),
    });

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Some student-transaction pairs already exist",
        existing: existing.map((e) => ({
          studentID: e.studentID,
          transactionID: e.transactionID,
        })),
      });
    }

    // Create all distributions
    const created = await IndividualDistribution.insertMany(
      distributions.map((d) => ({
        ...d,
        status: "pending",
      })),
    );

    // Populate for response
    const populated = await IndividualDistribution.find({
      _id: { $in: created.map((c) => c._id) },
    }).populate(["studentID", "transactionID"]);

    res.status(201).json({
      message: `Successfully created ${created.length} individual distributions`,
      distributions: populated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating batch distributions", error });
  }
};

// Update individual distribution
export const update = async (req: Request, res: Response) => {
  try {
    const { studentID, transactionID, description, status, remarks } = req.body;

    // If updating studentID, verify student exists
    if (studentID) {
      const student = await Scholar.findOne({ studentID });
      if (!student) {
        return res.status(400).json({ message: "Student not found" });
      }
    }

    // If updating transactionID, verify distribution exists
    if (transactionID) {
      const distribution = await Distribution.findOne({ transactionID });
      if (!distribution) {
        return res
          .status(400)
          .json({ message: "Distribution transaction not found" });
      }
    }

    // Check for duplicates if changing student-transaction pair
    if (studentID && transactionID) {
      const existing = await IndividualDistribution.findOne({
        studentID,
        transactionID,
        _id: { $ne: req.params.id },
      });

      if (existing) {
        return res.status(400).json({
          message:
            "Another entry already exists for this student and transaction",
        });
      }
    }

    // If marking as received, set receivedAt
    if (status === "received" && !req.body.receivedAt) {
      req.body.receivedAt = new Date();
    }

    const updated = await IndividualDistribution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    ).populate(["studentID", "transactionID"]);

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Individual distribution not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating individual distribution", error });
  }
};


// Mark as received
export const markAsReceived = async (req: Request, res: Response) => {
  try {
    const { remarks } = req.body;

    const updated = await IndividualDistribution.findByIdAndUpdate(
      req.params.id,
      {
        status: "received",
        receivedAt: new Date(),
        remarks: remarks || "Marked as received",
      },
      { new: true, runValidators: true },
    ).populate(["studentID", "transactionID"]);

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Individual distribution not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error marking as received", error });
  }
};

// Batch mark as received
export const batchMarkAsReceived = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body; // Array of distribution IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide an array of IDs" });
    }

    const result = await IndividualDistribution.updateMany(
      {
        _id: { $in: ids },
        status: "pending", // Only update pending ones
      },
      {
        status: "received",
        receivedAt: new Date(),
      },
    );

    // Get the updated documents
    const updated = await IndividualDistribution.find({
      _id: { $in: ids },
    }).populate(["studentID", "transactionID"]);

    res.status(200).json({
      message: `Marked ${result.modifiedCount} distributions as received`,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      distributions: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Error batch marking as received", error });
  }
};

// Delete individual distribution
export const remove = async (req: Request, res: Response) => {
  try {
    const deleted = await IndividualDistribution.findByIdAndDelete(
      req.params.id,
    );

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Individual distribution not found" });
    }

    res
      .status(200)
      .json({ message: "Individual distribution deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting individual distribution", error });
  }
};

// Get summary statistics
export const getSummary = async (req: Request, res: Response) => {
  try {
    const { studentID, transactionID, startDate, endDate } = req.query;

    let matchFilter: any = {};

    // Apply filters
    if (studentID) {
      matchFilter.studentID = parseInt(studentID as string);
    }
    if (transactionID) {
      matchFilter.transactionID = transactionID;
    }
    if (startDate || endDate) {
      matchFilter.createdAt = {};
      if (startDate) matchFilter.createdAt.$gte = new Date(startDate as string);
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        matchFilter.createdAt.$lte = end;
      }
    }

    const summary = await IndividualDistribution.aggregate([
      { $match: matchFilter },
      {
        $facet: {
          // Status breakdown
          byStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          // Overall stats
          overall: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                pending: {
                  $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                },
                received: {
                  $sum: { $cond: [{ $eq: ["$status", "received"] }, 1, 0] },
                },
                cancelled: {
                  $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
                },
              },
            },
          ],
          // Recent activity
          recentActivity: [
            { $match: { status: "received" } },
            { $sort: { receivedAt: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: "scholars",
                localField: "studentID",
                foreignField: "studentID",
                as: "student",
              },
            },
            { $unwind: "$student" },
          ],
        },
      },
    ]);

    const result = summary[0] || {};

    res.status(200).json({
      statusBreakdown: result.byStatus || [],
      totals: result.overall[0] || {
        total: 0,
        pending: 0,
        received: 0,
        cancelled: 0,
      },
      recentActivity: result.recentActivity || [],
      filters: {
        studentID: studentID || "all",
        transactionID: transactionID || "all",
        dateRange: startDate || endDate ? { startDate, endDate } : "all",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating summary", error });
  }
};
