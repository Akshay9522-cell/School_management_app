import { Request, Response } from "express";
import {
  addAttendanceService,
  getAttendanceService,
  getAttendanceByIdService,
  updateAttendanceService,
  deleteAttendanceService,
  bulkAttendanceService
} from "../services/attendanceService";

// ✅ Add Attendance
export const addAttendance = async (req: Request, res: Response) => {
  try {
    const attendance = await addAttendanceService(req.body);
    res.status(201).json({
      success: true,
      message: "Attendance added successfully",
      data: attendance,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all Attendances (with filters, pagination)
export const getAttendances = async (req: Request, res: Response) => {
  try {
    const result = await getAttendanceService(req.query);
    res.status(200).json({
      success: true,
      message: "Attendances fetched successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Attendance by ID
export const getAttendanceById = async (req: Request, res: Response) => {
  try {
    const attendance = await getAttendanceByIdService(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance not found" });
    }
    res.status(200).json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Attendance
export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const updated = await updateAttendanceService(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Attendance not found" });
    }
    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Attendance
export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteAttendanceService(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Attendance not found" });
    }
    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Bulk Attendance
export const bulkAttendance = async (req: Request, res: Response) => {
  try {
    const result = await bulkAttendanceService(req.body);
    res.status(200).json({
      success: true,
      message: "Attendance recorded successfully for the class",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
