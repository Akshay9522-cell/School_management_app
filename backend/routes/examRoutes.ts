import { Router } from "express";
import { generatePaperController } from "../controllers/Ai exam paper/examController";

const router = Router();

// POST /api/exam/generate
router.post("/generate", generatePaperController);


export default router;
