import express from "express";
import * as MarkController from "../../controllers/ReportCard/marksController";

const router = express.Router();

router.post("/add", MarkController.addMark);
router.put("/:id", MarkController.updateMark);
router.get("/student/:studentId/exam/:examId", MarkController.getMarksByStudentExam);
router.get("/class/:classId/exam/:examId", MarkController.getMarksByClassExam);

export default router;
