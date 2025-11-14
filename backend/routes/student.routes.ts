import { Router } from "express";
import auth from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller";
import {
  createStudentValidation,
  updateStudentValidation,
} from "../validations/studentValidation";

const router = Router();

router.post("/add", auth, validate(createStudentValidation), addStudent);
router.get("/all", auth, getStudents);
router.get("/:id", auth, getStudentById);
router.put("/:id", auth, validate(updateStudentValidation), updateStudent);
router.delete("/:id", auth, deleteStudent);

export default router;
