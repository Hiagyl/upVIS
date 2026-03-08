const Donations = require("../Model/Donations");
const Expenses = require("../Model/Expenses");

// ===============================
// GET ALL TRANSACTIONS
// ===============================
exports.getAllTransactions = async (req, res) => {
  try {
    const donations = await Donations.find();
    const expenses = await Expenses.find();

    const records = [
      ...donations.map(d => ({
        ...d.toObject(),
        type: "donation",
        date: d.dateReceived || d.createdAt || new Date()
      })),
      ...expenses.map(e => ({
        ...e.toObject(),
        type: "expense",
        date: e.date || e.createdAt || new Date()
      }))
    ];

    // Safe sort (no invalid dates)
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(records);
  } catch (err) {
    console.error("Finance fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// CREATE TRANSACTION
// ===============================
exports.createTransaction = async (req, res) => {
  try {
    let { type, description, amount, date } = req.body;
    type = type.toLowerCase();

    let record;

    if (type === "donation") {
      record = new Donations({
        donorID: "unknown",
        amount,
        dateReceived: date || new Date(),
        description,
        mode: "cash"
      });
    } else if (type === "expense") {
      record = new Expenses({
        responsibleID: "unknown",
        amount,
        date: date || new Date(),
        remarks: description
      });
    } else {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    await record.save();
    res.json({ ...record.toObject(), type });
  } catch (err) {
    console.error("Create transaction error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// UPDATE TRANSACTION
// ===============================
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    let { type, description, amount, date } = req.body;
    type = type.toLowerCase();

    let record;

    if (type === "donation") {
      record = await Donations.findByIdAndUpdate(
        id,
        { description, amount, dateReceived: date },
        { new: true }
      );
    } else if (type === "expense") {
      record = await Expenses.findByIdAndUpdate(
        id,
        { remarks: description, amount, date },
        { new: true }
      );
    } else {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    res.json({ ...record.toObject(), type });
  } catch (err) {
    console.error("Update transaction error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// DELETE TRANSACTION
// ===============================
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (type === "donation") {
      await Donations.findByIdAndDelete(id);
    } else if (type === "expense") {
      await Expenses.findByIdAndDelete(id);
    } else {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Delete transaction error:", err);
    res.status(500).json({ error: err.message });
  }
};
