import { Router } from "express";
import {
  addClassroom,
  getClassrooms,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
} from "../controllers/class.controller";
import auth from "../middleware/auth";

const router = Router();

// All routes protected
router.post("/add", auth, addClassroom);
router.get("/get", auth, getClassrooms);
router.get("/:id", auth, getClassroomById);
router.put("/:id", auth, updateClassroom);
router.delete("/:id", auth, deleteClassroom);

export default router;
