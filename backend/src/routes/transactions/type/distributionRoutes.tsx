import express from "express";
import * as distributionController from "../../../controllers/transactions/type/distributionController";

const router = express.Router();

// Base routes
router.get("/", distributionController.getAll);
router.post("/", distributionController.create);

router.get("/date-range", distributionController.getByDateRange);
router.get("/student/:studentId", distributionController.getByStudent);
router.get("/distribution/:transactionID", distributionController.getByTransactionId,);
router.get("/stats/summary", distributionController.getSummary);

// Dynamic routes
router.get("/:id", distributionController.getById);
router.put("/:id", distributionController.update);
router.delete("/:id", distributionController.remove);

export default router;
