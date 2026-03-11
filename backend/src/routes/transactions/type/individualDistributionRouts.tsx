import express from "express";
import * as individualDistributionController from "../../../controllers/transactions/type//individualDistributionController";

const router = express.Router();

// Base routes
router.get("/", individualDistributionController.getAll);
router.post("/", individualDistributionController.create);
router.get("/student/:studentID", individualDistributionController.getByStudent,);
router.get("/distribution/:transactionID", individualDistributionController.getByDistribution,);
router.get("/status/:status", individualDistributionController.getByStatus);
router.get("/stats/summary", individualDistributionController.getSummary);
router.post("/batch", individualDistributionController.createBatch);
router.patch("/batch/receive", individualDistributionController.batchMarkAsReceived,);
router.get("/:id", individualDistributionController.getById);
router.put("/:id", individualDistributionController.update);
router.patch("/:id/receive", individualDistributionController.markAsReceived);
router.delete("/:id", individualDistributionController.remove);

export default router;
