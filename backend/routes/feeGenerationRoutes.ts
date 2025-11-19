import { Router } from "express";
import { generateMonthlyFees } from "../controllers/feeGenerationController";
import auth from "../middleware/auth";

const router = Router();

router.post("/generate", auth, generateMonthlyFees);

export default router;
