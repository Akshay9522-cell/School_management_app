import { Router } from "express";
import { validate } from "../middleware/validate";
import {
  createClassValidation,
  updateClassValidation,
} from "../validations/classValidation";
import {
  addClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "../controllers/classController";

const router = Router();

// ✅ Create a class
router.post("/", validate(createClassValidation), addClass);

// ✅ Get all classes
router.get("/all", getClasses);

// ✅ Get class by ID
router.get("/:id", getClassById);

// ✅ Update class
router.put("/:id", validate(updateClassValidation), updateClass);

// ✅ Delete class
router.delete("/:id", deleteClass);

export default router;
