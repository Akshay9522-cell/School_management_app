// routes/dailyReportRoutes.ts
import { Router } from "express";
import { submitDailyReport } from "../../controllers/Test/testController";


const router = Router();

router.post("/report", submitDailyReport);

export default router;
