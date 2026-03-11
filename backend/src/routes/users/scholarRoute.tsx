import express from "express";
import * as scholarController from "../../controllers/users/scholarController";

const router = express.Router();

router.get("/", scholarController.getAll);
router.get("/:id", scholarController.getById);
router.get("/student/:studentID", scholarController.getByStudentId);
router.get("/status/:status", scholarController.getByStatus);
router.get("/program/:degreeProgram", scholarController.getByProgram);
router.get("/year/:yearLevel", scholarController.getByYearLevel);
router.post("/", scholarController.create);
router.put("/:id", scholarController.update);
router.delete("/:id", scholarController.remove);

export default router;
