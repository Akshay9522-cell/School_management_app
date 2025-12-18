import { Router } from "express";
import { seedAcademicClass, seedSubject, seedChapter, seedQuestion, seedPattern } from "../controllers/Ai exam paper/seedController";

const router = Router();

router.post("/academic-class", seedAcademicClass);
router.post("/subject", seedSubject);
router.post("/chapter", seedChapter);
router.post("/question", seedQuestion);
router.post("/pattern", seedPattern);

export default router;
