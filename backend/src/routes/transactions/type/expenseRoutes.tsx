import express from "express";
import * as expenseController from "../../../controllers/transactions/type/expenseController";

const router = express.Router();

router.get("/", expenseController.getAll);
router.post("/", expenseController.create);
router.get("/date-range", expenseController.getByDateRange);
router.get("/member/:memberID", expenseController.getByMember);
router.get("/expense/:transactionID", expenseController.getByTransactionId);
router.get("/stats/summary", expenseController.getSummary);
router.get("/:id", expenseController.getById);
router.put("/:id", expenseController.update);
router.delete("/:id", expenseController.remove);

export default router;
