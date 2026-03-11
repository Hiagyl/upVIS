import express from "express";
import * as memberController from "../../controllers/users/memberController";

const router = express.Router();

router.get("/", memberController.getAll);
router.post("/", memberController.create);
router.get("/status/:status", memberController.getByStatus);
router.get("/member/:memberID", memberController.getByMemberId);
router.get("/:id", memberController.getById);
router.put("/:id", memberController.update);
router.delete("/:id", memberController.remove);

export default router;
