// routes/reportRoutes.ts
import express from "express";
import { addReportToStudent } from "../../controllers/reportCard/reportController";
import { getClassWeeklyReport } from "../../controllers/weeklyReport/weeklyReportController";
import { sendWeeklyReports } from "../../controllers/weeklyReport/whatsappController";

const router = express.Router();

router.post("/add", addReportToStudent);
router.get("/weekly/class/:classId",getClassWeeklyReport);
router.get("/whatsapp/weekly/class/:classId",sendWeeklyReports);


export default router;
