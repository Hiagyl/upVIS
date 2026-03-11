import express from "express";
import * as donorController from "../../controllers/users/donorController";

const router = express.Router();

router.get("/", donorController.getAll);
router.post("/", donorController.create);
router.get("/donor/:donorID", donorController.getByDonorId);
router.get("/:id", donorController.getById);
router.put("/:id", donorController.update);
router.delete("/:id", donorController.remove);

export default router;
