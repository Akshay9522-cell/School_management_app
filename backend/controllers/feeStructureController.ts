import { Request, Response } from "express";
import {
  createFeeStructureService,
  getFeeStructuresService,
  getFeeStructureByClassService,
  updateFeeStructureService,
  deleteFeeStructureService,
} from "../services/feeStructureService";

// Create
export const createFeeStructure = async (req: Request, res: Response) => {
  try {
    const data = await createFeeStructureService(req.body);
    res.status(201).json({ success: true, message: "Fee Structure created", data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all
export const getFeeStructures = async (req: Request, res: Response) => {
  try {
    const data = await getFeeStructuresService();
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get by class
export const getFeeStructureByClass = async (req: Request, res: Response) => {
  try {
    const data = await getFeeStructureByClassService(req.params.classId);

    if (!data) {
      return res.status(404).json({ success: false, message: "Fee structure not found for this class" });
    }

    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update
export const updateFeeStructure = async (req: Request, res: Response) => {
  try {
    const data = await updateFeeStructureService(req.params.id, req.body);

    if (!data) {
      return res.status(404).json({ success: false, message: "Fee structure not found" });
    }

    res.status(200).json({ success: true, message: "Fee structure updated", data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete
export const deleteFeeStructure = async (req: Request, res: Response) => {
  try {
    const data = await deleteFeeStructureService(req.params.id);

    if (!data) {
      return res.status(404).json({ success: false, message: "Fee structure not found" });
    }

    res.status(200).json({ success: true, message: "Fee structure deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
