import express from "express";
import {
  addTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController";
import { validate } from "../middleware/validate";
import {
  createTeacherValidation,
  updateTeacherValidation,
} from "../validations/teacherValidation";

const router = express.Router();

router.post("/add", validate(createTeacherValidation), addTeacher);
router.get("/all", getTeachers);
router.get("/:id", getTeacherById);
router.put("/:id", validate(updateTeacherValidation), updateTeacher);
router.delete("/:id", deleteTeacher);

export default router;
