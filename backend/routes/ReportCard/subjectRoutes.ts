import express from "express";
import { createSubject, deleteSubject, getSubjectsByClass, updateSubject } from "../../controllers/ReportCard/subjectController";

const router = express.Router();

router.post("/create", createSubject);
router.get("/class/:classId", getSubjectsByClass);
router.put("/:subjectId", updateSubject);
router.delete("/:subjectId", deleteSubject);


export default router;
