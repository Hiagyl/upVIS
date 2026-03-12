const { Router } = require("express");
const TransactionController = require("../../controllers/TransactionController");

const route = Router();

module.exports = (app) => {
  // Attach to main app
  app.use("/api/transactions", route);

  // Define endpoints
  route.get("/", TransactionController.getTransactions);
  route.post("/", TransactionController.createTransaction);
  route.put("/:id", TransactionController.updateTransaction);
  route.delete("/:id", TransactionController.deleteTransaction);
};
