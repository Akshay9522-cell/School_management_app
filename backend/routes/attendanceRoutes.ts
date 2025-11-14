import { Router } from "express";
import { validate } from "../middleware/validate";
import auth from "../middleware/auth";
import {
  addAttendance,
  getAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  bulkAttendance
} from "../controllers/attendanceController";
import { createAttendanceValidation, updateAttendanceValidation } from "../validations/attendanceValidation";

const router = Router();

/**
 * @route   POST /api/attendance
 * @desc    Record new attendance
 * @access  Private
 */
router.post("/add", auth, validate(createAttendanceValidation), addAttendance);

/**
 * @route   GET /api/attendance
 * @desc    Get all attendance records with filters, pagination
 * @access  Private
 */
router.get("/all", auth, getAttendances);

/**
 * @route   GET /api/attendance/:id
 * @desc    Get single attendance record by ID
 * @access  Private
 */
router.get("/:id", auth, getAttendanceById);

/**
 * @route   PUT /api/attendance/:id
 * @desc    Update attendance record
 * @access  Private
 */
router.put("/:id", auth, validate(updateAttendanceValidation), updateAttendance);

/**
 * @route   DELETE /api/attendance/:id
 * @desc    Delete attendance record
 * @access  Private
 */
router.delete("/:id", auth, deleteAttendance);

// POST /attendance/bulk
router.post("/bulk", bulkAttendance);


export default router;
