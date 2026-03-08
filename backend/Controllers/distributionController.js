const Distribution = require("../Model/Distributions");

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const data = await Distribution.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const count = await Distribution.countDocuments();
    const distributionID = `DIST-${String(count + 1).padStart(4, "0")}`;

    const record = new Distribution({
      ...req.body,
      distributionID
    });

    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const updated = await Distribution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    await Distribution.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
