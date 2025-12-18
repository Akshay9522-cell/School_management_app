import { Request, Response } from "express";
import {
  createFeeTypeService,
  getFeeTypesService,
  getFeeTypeByIdService,
  updateFeeTypeService,
  deleteFeeTypeService,
} from "../services/feeTypeService";

// ✅ Create Fee Type
export const createFeeType = async (req: Request, res: Response) => {
  try {
    const feeType = await createFeeTypeService(req.body);

    res.status(201).json({
      success: true,
      message: "Fee Type created successfully",
      data: feeType,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Fee Types
export const getFeeTypes = async (req: Request, res: Response) => {
  try {
    const feeTypes = await getFeeTypesService();

    res.status(200).json({
      success: true,
      data: feeTypes,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Fee Type by ID
export const getFeeTypeById = async (req: Request, res: Response) => {
  try {
    const feeType = await getFeeTypeByIdService(req.params.id);

    if (!feeType) {
      return res.status(404).json({ success: false, message: "Fee Type not found" });
    }

    res.status(200).json({ success: true, data: feeType });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Fee Type
export const updateFeeType = async (req: Request, res: Response) => {
  try {
    const updated = await updateFeeTypeService(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: "Fee Type not found" });
    }

    res.status(200).json({
      success: true,
      message: "Fee Type updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Fee Type
export const deleteFeeType = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteFeeTypeService(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Fee Type not found" });
    }

    res.status(200).json({
      success: true,
      message: "Fee Type deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
