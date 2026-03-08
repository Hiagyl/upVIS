// routes/financeRoutes.js
const express = require("express");
const router = express.Router();
const financeController = require("../Controllers/financeController");

// Fetch all transactions
router.get("/", financeController.getAllTransactions);

// Add transaction
router.post("/", financeController.createTransaction);

// Update transaction
router.put("/:id", financeController.updateTransaction);

// Delete transaction
router.delete("/:id", financeController.deleteTransaction);

module.exports = router;
