import { Router } from "express";
import auth from "../middleware/auth";
import { checkInWithQR, checkOutWithQR } from "../controllers/attendanceQr.controller";

const router = Router();


router.post("/check-in", auth, checkInWithQR);
router.post("/check-out", auth, checkOutWithQR);

export default router;
