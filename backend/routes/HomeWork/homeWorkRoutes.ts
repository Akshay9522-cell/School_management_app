import express from "express";
import { createHomework, getClassHomework, getTeacherHomework } from "../../controllers/homeWork/homeWorkController";

const router = express.Router();

router.post("/create", createHomework);
router.get("/class", getClassHomework);
router.get("/teacher/:teacherId", getTeacherHomework); 
export default router;
