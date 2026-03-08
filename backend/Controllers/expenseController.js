const Expense = require("../Model/Expenses");

// Get all expenses
exports.getAll = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving expenses", error });
    }
};

// Get expense by ID
exports.getById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving expense", error });
    }
};

// Create a new expense
exports.create = async (req, res) => {
    try {
        const { amount, date, responsibleID, receipt, remarks } = req.body;

        if (!amount || !responsibleID) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newExpense = new Expense({
            amount,
            date,
            responsibleID,
            receipt,
            remarks
        });

        await newExpense.save();
        res.status(201).json({ message: "Expense created successfully", newExpense });
    } catch (error) {
        res.status(400).json({ message: "Error creating expense", error });
    }
};

// Update expense by ID
exports.update = async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json({ message: "Expense updated successfully", updatedExpense });
    } catch (error) {
        res.status(400).json({ message: "Error updating expense", error });
    }
};

// Delete expense by ID
exports.delete = async (req, res) => {
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
