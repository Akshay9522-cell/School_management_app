import { Router } from "express";
import auth from "../middleware/auth";
import { addStudent, getStudents,getStudentById,updateStudent } from "../controllers/student.controller";

const router = Router();

router.post("/add",auth, addStudent);       // ✅ Protected
router.get("/all", auth, getStudents);       // ✅ Protected
router.get('/:id',auth,getStudentById)
router.put('/:id',auth,updateStudent)
export default router;
