import express from "express";
import {
  createTest,
  getTestsByClass,
  updateTest,
  deleteTest,
} from "../../controllers/Test/testController";

const router = express.Router();

router.post("/create", createTest);
router.get("/class/:classId", getTestsByClass);
router.put("/:testId", updateTest);
router.delete("/:testId", deleteTest);

export default router;
