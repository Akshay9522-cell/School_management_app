// controllers/attendance.controller.ts
import { Request, Response } from "express";
import { attendanceCheckSchema } from "../validations/attendance.schema";
import AttendanceService from "../services/attendance.Service";

const getPerformedBy = (req: any) => req.user?._id;

export const checkIn = async (req: Request, res: Response) => {
  try {
    const parsed = attendanceCheckSchema.parse(req.body);
    console.log(req.body)

    // Use teacherId from req.user OR from request body (for testing)
    const teacherId = req.body.teacherId;
    if (!teacherId) throw new Error("Teacher ID is required");

    const attendance = await AttendanceService.checkIn({
      teacherId,
      classroomCode: parsed.classroomCode,
      lat: parsed.lat,
      lng: parsed.lng,
      performedBy: getPerformedBy(req),
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || String(err) });
  }
};

export const checkOut = async (req: Request, res: Response) => {
  try {
    const parsed = attendanceCheckSchema.parse(req.body);

    // Use teacherId from req.user OR from request body
    const teacherId =  req.body.teacherId;
    if (!teacherId) throw new Error("Teacher ID is required");

    const attendance = await AttendanceService.checkOut({
      teacherId,
      classroomCode: parsed.classroomCode,
      lat: parsed.lat,
      lng: parsed.lng,
      performedBy: getPerformedBy(req),
    });

    res.status(200).json({ success: true, data: attendance });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || String(err) });
  }
};

export const summary = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const result = await AttendanceService.getSummaryForDate(date as string | undefined);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || String(err) });
  }
};

export const history = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.teacherId || req.query.teacherId;
    if (!teacherId) throw new Error("Teacher ID is required");

    const { from, to } = req.query;
    const result = await AttendanceService.getHistoryForTeacher(
      teacherId as string,
      from as string | undefined,
      to as string | undefined
    );

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || String(err) });
  }
};
