import { Router } from "express";
import auth from "../middleware/auth";
import { checkInWithQR, checkOutWithQR } from "../controllers/Attandance/attendanceQr.controller";
import { attendanceSummary } from "../controllers/Attandance/attendanceSummary.controller";

const router = Router();

router.get("/summary", auth, attendanceSummary); 
router.post("/check-in", auth, checkInWithQR);
router.post("/check-out", auth, checkOutWithQR);

export default router;
