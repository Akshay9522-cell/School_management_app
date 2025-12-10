// routes/reportRoutes.ts
import express from "express";
import { addReportToStudent } from "../../controllers/reportCard/reportController";

const router = express.Router();

router.post("/add", addReportToStudent);

export default router;
