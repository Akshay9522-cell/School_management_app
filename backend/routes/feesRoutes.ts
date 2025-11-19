import express from "express";
import {
  createStudentFee,
  getStudentFees,
  getStudentFeeById,
  addPayment,
  deleteStudentFee,
} from "../controllers/feesController";
import auth from "../middleware/auth";

const router = express.Router();

// ✅ All routes protected by auth middleware
router.use(auth);

// Create a new fee record
router.post("/", createStudentFee);

// Get all fees (with optional filters: student, class, month, year)
router.get("/", getStudentFees);

// Get a fee by ID
router.get("/:id", getStudentFeeById);

// Add a payment to a fee
router.post("/:id/payment", addPayment);

// Delete a fee
router.delete("/:id", deleteStudentFee);

export default router;
