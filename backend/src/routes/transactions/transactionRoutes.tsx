import express from "express";
import * as transactionController from "../../controllers/transactions/transactionController";

const router = express.Router();


router.get("/", transactionController.getAll);
router.post("/", transactionController.create);


router.get("/type/:transactionType", transactionController.getByType);
router.get("/date-range", transactionController.getByDateRange);
router.get("/transaction/:transactionID", transactionController.getByTransactionId,);
router.get("/stats/summary", transactionController.getSummary);

// Dynamic routes
router.get("/:id", transactionController.getById);
router.put("/:id", transactionController.update);
router.delete("/:id", transactionController.remove);

export default router;
