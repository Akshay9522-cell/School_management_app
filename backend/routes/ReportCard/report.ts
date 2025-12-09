import { Router } from "express";
import {
  createTerm,
  getTerms,
  createExam,
  getAllExams,
  getExamsByTerm,
  addDateSheet,
  getDateSheet
} from "../../controllers/ReportCard/termController";

const router = Router();

/* ---------------------- TERM ROUTES ---------------------- */

// CREATE TERM
router.post("/terms", createTerm);

// GET ALL TERMS
router.get("/terms", getTerms);


/* ---------------------- EXAM ROUTES ---------------------- */

// CREATE EXAM
router.post("/exams", createExam);

// GET ALL EXAMS
router.get("/exams", getAllExams);

// GET EXAMS BY TERM
router.get("/exams/term/:termId", getExamsByTerm);


/* ------------------- DATE-SHEET ROUTES ------------------- */

// ADD DATE-SHEET ENTRY
router.post("/datesheet", addDateSheet);

// GET DATE-SHEET BY EXAM & CLASS
router.get("/datesheet/:examId/:classId", getDateSheet);


export default router;
