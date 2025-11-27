import { Request, Response } from "express";
import AttendanceService from "../services/attendance.Service";
import Classroom, { IClassroom } from "../models/classroom";
import Teacher, { ITeacher } from "../models/Teacher";
import { verifyLocationRadius } from "../utils/location";

// ----------------------------
// QR CHECK-IN
// ----------------------------
export const checkInWithQR = async (req: Request, res: Response) => {
  try {
    const { classroomCode, teacherId, lat, lng } = req.body;

    if (!classroomCode || !teacherId) {
      return res.status(400).json({ success: false, message: "classroomCode & teacherId required" });
    }

    const classroom = await Classroom.findOne({ code: classroomCode }) as IClassroom | null;
    if (!classroom) {
      return res.status(404).json({ success: false, message: "Invalid classroom QR" });
    }

    const teacher = await Teacher.findById(teacherId) as ITeacher | null;
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    console.log("Teacher classIds:", teacher.classIds);
    console.log("Classroom _id:", classroom._id.toString());

    // -----------------------------
    // 3) Check class assignment
    // -----------------------------
    const isAssigned = teacher.classIds?.some(id => id.toString() === classroom._id.toString());
    console.log(isAssigned)

    if (!isAssigned) {
      console.warn(`Teacher not assigned to classroom. Adding temporarily for testing...`);
      // --- TEMP FIX FOR TESTING ---
    
    
    
      teacher.classIds = teacher.classIds || [];
  teacher.classIds.push(classroom._id as any);
  await teacher.save();  // await Teacher.findByIdAndUpdate(teacherId, { $addToSet: { classIds: classroom._id } });
      return res.status(403).json({ success: false, message: "You are not assigned to this classroom" });
    }

    // -----------------------------
    // 4) Verify location radius
    // -----------------------------
    if (classroom.location) {
      const inside = verifyLocationRadius(lat, lng, classroom.location.lat, classroom.location.lng, 30);
      if (!inside) {
        return res.status(403).json({ success: false, message: "You are not inside classroom area" });
      }
    }

    // -----------------------------
    // 5) Mark check-in
    // -----------------------------
    const attendance = await AttendanceService.checkIn({
      teacherId,
      classroomCode: classroom.code,
      lat,
      lng,
      performedBy: teacherId
    });

    return res.status(201).json({
      success: true,
      message: "Check-in successful",
      data: attendance
    });

  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ----------------------------
// QR CHECK-OUT
// ----------------------------
export const checkOutWithQR = async (req: Request, res: Response) => {
  try {
    const { classroomCode, teacherId, lat, lng } = req.body;

    if (!classroomCode || !teacherId) {
      return res.status(400).json({ success: false, message: "classroomCode & teacherId required" });
    }

    const classroom = await Classroom.findOne({ code: classroomCode }) as IClassroom | null;
    if (!classroom) {
      return res.status(404).json({ success: false, message: "Invalid classroom QR" });
    }

    const teacher = await Teacher.findById(teacherId) as ITeacher | null;
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    console.log("Teacher classIds:", teacher.classIds);
    console.log("Classroom _id:", classroom._id.toString());

    const isAssigned = teacher.classIds?.some(id => id.toString() === classroom._id.toString());

    if (!isAssigned) {
      console.warn(`Teacher not assigned to classroom. Adding temporarily for testing...`);
      // --- TEMP FIX FOR TESTING ---
      // await Teacher.findByIdAndUpdate(teacherId, { $addToSet: { classIds: classroom._id } });
      return res.status(403).json({ success: false, message: "You are not assigned to this classroom" });
    }

    if (classroom.location) {
      const inside = verifyLocationRadius(lat, lng, classroom.location.lat, classroom.location.lng, 30);
      if (!inside) {
        return res.status(403).json({ success: false, message: "You are not inside classroom area" });
      }
    }

    const attendance = await AttendanceService.checkOut({
      teacherId,
      classroomCode: classroom.code,
      lat,
      lng,
      performedBy: teacherId
    });

    return res.status(200).json({
      success: true,
      message: "Check-out successful",
      data: attendance
    });

  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
