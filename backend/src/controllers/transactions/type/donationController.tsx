import { Request, Response } from "express";
import Donation from "../../../models/transactions/type/donations";
import Donor from "../../../models/users/donors";

// Get all donations
export const getAll = async (req: Request, res: Response) => {
  try {
    const { limit, sort } = req.query;
    let query = Donation.find().populate("donorID"); // Populate donor details

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

    const donations = await query;
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

// Get donation by ID (MongoDB _id)
export const getById = async (req: Request, res: Response) => {
  try {
    const donation = await Donation.findById(req.params.id).populate("donorID");
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donation", error });
  }
};

// Get donation by custom transactionID
export const getByTransactionId = async (req: Request, res: Response) => {
  try {
    const donation = await Donation.findOne({
      transactionID: req.params.transactionID,
    }).populate("donorID");

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donation", error });
  }
};

// Get donations by donor ID
export const getByDonor = async (req: Request, res: Response) => {
  try {
    const donorID = req.params.donorID;

    const donations = await Donation.find({ donorID })
      .populate("donorID")
      .sort({ date: -1 });

    // Get donor total
    const total = await Donation.aggregate([
      { $match: { donorID } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      donations,
      donorTotal: total[0]?.totalAmount || 0,
      count: donations.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching donations for donor", error });
  }
};

// Get donations by payment mode
export const getByMode = async (req: Request, res: Response) => {
  try {
    const mode = req.params.mode;

    // Validate mode
    const validModes = ["Cash", "GCash", "Paymaya", "Bank Transfer", "Others"];
    if (!validModes.includes(mode)) {
      return res.status(400).json({
        message:
          "Invalid mode. Use: Cash, GCash, Paymaya, Bank Transfer, Others",
      });
    }

    const donations = await Donation.find({ mode })
      .populate("donorID")
      .sort({ date: -1 });

    // Get mode total
    const total = await Donation.aggregate([
      { $match: { mode } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      donations,
      modeTotal: total[0]?.totalAmount || 0,
      count: donations.length,
      mode,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching donations by mode", error });
  }
};

// Get donations by date range
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

    const donations = await Donation.find({
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .populate("donorID")
      .sort({ date: -1 });

    // Get total for date range
    const total = await Donation.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      donations,
      periodTotal: total[0]?.totalAmount || 0,
      count: donations.length,
      dateRange: { start, end },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching donations by date range", error });
  }
};

// Create new donation
export const create = async (req: Request, res: Response) => {
  try {
    const {
      transactionID,
      amount,
      description,
      date,
      donorID,
      mode,
      receipt,
      remarks,
    } = req.body;

    // Check if transactionID already exists
    const existing = await Donation.findOne({ transactionID });
    if (existing) {
      return res.status(400).json({ message: "Transaction ID already exists" });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    // Validate mode
    const validModes = ["Cash", "GCash", "Paymaya", "Bank Transfer", "Others"];
    if (!validModes.includes(mode)) {
      return res.status(400).json({
        message:
          "Invalid mode. Use: Cash, GCash, Paymaya, Bank Transfer, Others",
      });
    }

    // Verify donor exists
    const donor = await Donor.findOne({ donorID });
    if (!donor) {
      return res.status(400).json({ message: "Donor not found" });
    }

    const newDonation = new Donation({
      transactionID,
      amount,
      description,
      transactionType: "donation",
      date: date || Date.now(),
      donorID,
      mode,
      receipt,
      remarks,
    });

    const savedDonation = await newDonation.save();

    // Populate donor details before returning
    await savedDonation.populate("donorID");

    res.status(201).json(savedDonation);
  } catch (error) {
    res.status(500).json({ message: "Error creating donation", error });
  }
};

// Update donation
export const update = async (req: Request, res: Response) => {
  try {
    const {
      transactionID,
      amount,
      description,
      date,
      donorID,
      mode,
      receipt,
      remarks,
    } = req.body;

    // Check if updating transactionID and if it already exists
    if (transactionID) {
      const existing = await Donation.findOne({
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

    // Validate mode if provided
    if (mode) {
      const validModes = [
        "Cash",
        "GCash",
        "Paymaya",
        "Bank Transfer",
        "Others",
      ];
      if (!validModes.includes(mode)) {
        return res.status(400).json({
          message:
            "Invalid mode. Use: Cash, GCash, Paymaya, Bank Transfer, Others",
        });
      }
    }

    // Verify donor exists if provided
    if (donorID) {
      const donor = await Donor.findOne({ donorID });
      if (!donor) {
        return res.status(400).json({ message: "Donor not found" });
      }
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        transactionID,
        amount,
        description,
        transactionType: "donation",
        date,
        donorID,
        mode,
        receipt,
        remarks,
      },
      { new: true, runValidators: true },
    ).populate("donorID");

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json(updatedDonation);
  } catch (error) {
    res.status(500).json({ message: "Error updating donation", error });
  }
};


// Delete donation
export const remove = async (req: Request, res: Response) => {
  try {
    const deletedDonation = await Donation.findByIdAndDelete(req.params.id);

    if (!deletedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting donation", error });
  }
};

// Get donation summary/stats
export const getSummary = async (req: Request, res: Response) => {
  try {
    const { year, month, donorID, mode } = req.query;

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

    // Donor filtering
    if (donorID) {
      matchFilter.donorID = donorID;
    }

    // Mode filtering
    if (mode) {
      matchFilter.mode = mode;
    }

    const summary = await Donation.aggregate([
      { $match: matchFilter },
      {
        $facet: {
          // Overall stats
          overall: [
            {
              $group: {
                _id: null,
                totalDonations: { $sum: "$amount" },
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
          // Stats by mode
          byMode: [
            {
              $group: {
                _id: "$mode",
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
          ],
          // Top donors
          topDonors: [
            {
              $group: {
                _id: "$donorID",
                totalAmount: { $sum: "$amount" },
                timesDonated: { $sum: 1 },
              },
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "donors",
                localField: "_id",
                foreignField: "donorID",
                as: "donorInfo",
              },
            },
            { $unwind: "$donorInfo" },
          ],
        },
      },
    ]);

    const result = summary[0] || {};

    res.status(200).json({
      summary: {
        totalDonations: result.overall[0]?.totalDonations || 0,
        totalTransactions: result.overall[0]?.totalTransactions || 0,
        averageAmount: result.overall[0]?.averageAmount || 0,
        minAmount: result.overall[0]?.minAmount || 0,
        maxAmount: result.overall[0]?.maxAmount || 0,
      },
      byMonth: result.byMonth || [],
      byMode: result.byMode || [],
      topDonors: result.topDonors || [],
      filters: {
        year: year || "all",
        month: month || "all",
        donorID: donorID || "all",
        mode: mode || "all",
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating donation summary", error });
  }
};
