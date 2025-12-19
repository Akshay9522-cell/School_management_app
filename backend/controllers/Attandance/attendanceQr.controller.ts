// controllers/Attandance/attendanceQr.controller.ts
import { Request, Response } from "express";
import AttendanceService from "../../services/attendance.service";
import Classroom, { IClassroom } from "../../models/classroom";
import Teacher, { ITeacher } from "../../models/Teacher";
import { verifyLocationRadius } from "../../utils/location";

/**
 * QR check-in controller
 */
export const checkInWithQR = async (req: Request, res: Response) => {
  try {
    const teacherFromToken = (req as any).user;
    const { classroomCode, teacherId: teacherIdFromBody, lat, lng } = req.body;

    // 1) Decide which teacherId to use:
    //    - If teacherId in body -> use that (for admin scanning for teacher)
    //    - Else if token is teacher -> use token id
    const teacherId =
      teacherIdFromBody ||
      (teacherFromToken?.role === "teacher" ? teacherFromToken.id : null);

    console.log("---- QR CHECK-IN ----");
    console.log("teacherFromToken:", teacherFromToken);
    console.log("teacherIdFromBody:", teacherIdFromBody);
    console.log("final teacherId used:", teacherId);
    console.log("classroomCode:", classroomCode);

    if (!classroomCode || !teacherId) {
      return res
        .status(400)
        .json({ success: false, message: "classroomCode & teacherId required" });
    }

    const classroom = (await Classroom.findOne({
      code: classroomCode,
    })) as IClassroom | null;
    if (!classroom) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid classroom QR" });
    }

    const teacher = (await Teacher.findById(teacherId)) as ITeacher | null;
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    const isAssigned = teacher.classIds?.some(
      (id) => id.toString() === classroom._id.toString()
    );
    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this classroom",
      });
    }

    if (classroom.location) {
      const inside = verifyLocationRadius(
        lat,
        lng,
        classroom.location.lat,
        classroom.location.lng,
        30
      );
      if (!inside) {
        return res.status(403).json({
          success: false,
          message: "You are not inside classroom area",
        });
      }
    }

    const attendance = await AttendanceService.checkIn({
      teacherId,
      classroomCode: classroom.code,
      lat,
      lng,
      performedBy: (req as any).user?.id || teacherId,
    });

    return res.status(201).json({
      success: true,
      message: "Check-in successful",
      data: attendance,
    });
  } catch (err: any) {
    console.error("checkInWithQR error:", err);
    return res
      .status(400)
      .json({ success: false, message: err.message || "Check-in failed" });
  }
};

/**
 * QR check-out controller
 */
export const checkOutWithQR = async (req: Request, res: Response) => {
  try {
    const teacherFromToken = (req as any).user;
    const { classroomCode, teacherId: teacherIdFromBody, lat, lng } = req.body;

    const teacherId =
      teacherIdFromBody ||
      (teacherFromToken?.role === "teacher" ? teacherFromToken.id : null);

    console.log("---- QR CHECK-OUT ----");
    console.log("teacherFromToken:", teacherFromToken);
    console.log("teacherIdFromBody:", teacherIdFromBody);
    console.log("final teacherId used:", teacherId);
    console.log("classroomCode:", classroomCode);

    if (!classroomCode || !teacherId) {
      return res
        .status(400)
        .json({ success: false, message: "classroomCode & teacherId required" });
    }

    const classroom = (await Classroom.findOne({
      code: classroomCode,
    })) as IClassroom | null;
    if (!classroom) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid classroom QR" });
    }

    const teacher = (await Teacher.findById(teacherId)) as ITeacher | null;
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    const isAssigned = teacher.classIds?.some(
      (id) => id.toString() === classroom._id.toString()
    );
    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this classroom",
      });
    }

    if (classroom.location) {
      const inside = verifyLocationRadius(
        lat,
        lng,
        classroom.location.lat,
        classroom.location.lng,
        30
      );
      console.log(inside)
      if (!inside) {
        return res.status(403).json({
          success: false,
          message: "You are not inside classroom area",
        });
      }
    }

    const attendance = await AttendanceService.checkOut({
      teacherId,
      classroomCode: classroom.code,
      lat,
      lng,
      performedBy: (req as any).user?.id || teacherId,
    });

    return res.status(200).json({
      success: true,
      message: "Check-out successful",
      data: attendance,
    });
  } catch (err: any) {
    console.error("checkOutWithQR error:", err);
    return res
      .status(400)
      .json({ success: false, message: err.message || "Check-out failed" });
  }
};
