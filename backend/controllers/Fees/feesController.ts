import { Request, Response } from "express";
import {
  createStudentFeeService,
  getStudentFeesService,
  getStudentFeeByIdService,
  addPaymentService,
  deleteStudentFeeService,
} from "../services/feesService";

// Create student fee
export const createStudentFee = async (req: Request, res: Response) => {
  try {
    const fee = await createStudentFeeService(req.body);
    res.status(201).json({
      success: true,
      message: "Student fee created successfully",
      data: fee,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all fees
export const getStudentFees = async (req: Request, res: Response) => {
  try {
    const fees = await getStudentFeesService(req.query);
    res.status(200).json({ success: true, data: fees });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get fee by ID
export const getStudentFeeById = async (req: Request, res: Response) => {
  try {
    const fee = await getStudentFeeByIdService(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: "Fee not found" });

    res.status(200).json({ success: true, data: fee });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Add payment to fee
export const addPayment = async (req: Request, res: Response) => {
  try {
    const fee = await addPaymentService(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Payment added successfully",
      data: fee,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete fee
export const deleteStudentFee = async (req: Request, res: Response) => {
  try {
    const fee = await deleteStudentFeeService(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: "Fee not found" });

    res.status(200).json({ success: true, message: "Fee deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
