import express from "express";
import * as donationController from "../../../controllers/transactions/type/donationController";

const router = express.Router();

router.get("/", donationController.getAll);
router.post("/", donationController.create);
router.get("/date-range", donationController.getByDateRange);
router.get("/donor/:donorID", donationController.getByDonor);
router.get("/mode/:mode", donationController.getByMode);
router.get("/donation/:transactionID", donationController.getByTransactionId);
router.get("/stats/summary", donationController.getSummary);
router.get("/:id", donationController.getById);
router.put("/:id", donationController.update);
router.delete("/:id", donationController.remove);

export default router;
