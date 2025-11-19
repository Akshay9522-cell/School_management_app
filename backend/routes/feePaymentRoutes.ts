import { Router } from "express";
import { recordPayment } from "../controllers/feePaymentController";
import auth from "../middleware/auth";

const router = Router();

// PUT /api/fees/pay/:feeId
router.put("/pay/:feeId", auth, recordPayment);

export default router;
