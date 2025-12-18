import { Router } from "express";
import auth from "../middleware/auth";
import {
  markAttendance,
  getAttendanceByClassDate,
  attendanceSummary,
  getStudentAttendance,
} from "../controllers/Attandance/studentAttendance.controller"
const router = Router();

router.post("/mark", auth, markAttendance);
router.get("/", auth, getAttendanceByClassDate);
router.get("/studentsummary", auth, attendanceSummary);
router.get("/student/:studentId", auth, getStudentAttendance);

export default router;
