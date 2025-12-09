import express from "express";
import * as ReportCardController from "../../controllers/ReportCard/gradeController";

const router = express.Router();

router.get("/report/student/:studentId/exam/:examId", ReportCardController.getReportCardByStudent);

export default router;
