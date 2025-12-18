import { Request, Response } from "express";
import AttendanceService from "../../services/attendance.service";
import Classroom, { IClassroom } from "../../models/classroom";
import Teacher, { ITeacher } from "../../models/Teacher";
import { verifyLocationRadius } from "../../utils/location";
import mongoose from "mongoose";

/**
 * QR check-in controller
 */
export const checkInWithQR = async (req: Request, res: Response) => {
  try {
    // prefer teacherId from token (req.user) if available, fallback to body
    const teacherFromToken = (req as any).user;
   

    //   console.log("Teacher ID from token:", (req as any).user?.id);
    // console.log("Teacher ID from body:", req.body.teacherId)
    const { classroomCode, teacherId: teacherIdFromBody, lat, lng } = req.body;
   
  //console.log(req.body)
  const teacherId = teacherIdFromBody;
  
  
console.log("Teacher ID from token:", teacherFromToken?.id);
console.log("Teacher ID from body:", teacherIdFromBody);
// console.log("Testing DB...");
// console.log("All teachers:", await Teacher.find({}, { name: 1 }));
// console.log("Direct findById:", await Teacher.findById("691b3a35eacdf1d099d038cb"));
// console.log("findOne with ObjectId:", await Teacher.findOne({ _id: new mongoose.Types.ObjectId("691b3a35eacdf1d099d038cb") }));


    // console.log("Find teacher by ID:", await Teacher.findById("691b3a35eacdf1d099d038cb"));
//console.log("All teachers:", await Teacher.find({}, "_id name"));


    if (!classroomCode || !teacherId) {
      return res.status(400).json({ success: false, message: "classroomCode & teacherId required" });
    }

    const classroom = await Classroom.findOne({ code: classroomCode }) as IClassroom | null;
    if (!classroom) {
      return res.status(404).json({ success: false, message: "Invalid classroom QR" });
    }

    const teacher = await Teacher.findById(teacherId) as ITeacher | null;
    console.log(teacher)
  
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    // 3) Check class assignment - do NOT mutate teacher record here
    const isAssigned = teacher.classIds?.some(id => id.toString() === classroom._id.toString());
    if (!isAssigned) {
      return res.status(403).json({ success: false, message: "You are not assigned to this classroom" });
    }

    // 4) Verify location radius (if classroom has a location)
    if (classroom.location) {
      const inside = verifyLocationRadius(lat, lng, classroom.location.lat, classroom.location.lng, 30);
      if (!inside) {
        return res.status(403).json({ success: false, message: "You are not inside classroom area" });
      }
    }

    // 5) Mark check-in via service
    const attendance = await AttendanceService.checkIn({
      teacherId,
      classroomCode: classroom.code,
      lat,
      lng,
      performedBy: (req as any).user?.id || teacherId
    });

    return res.status(201).json({
      success: true,
      message: "Check-in successful",
      data: attendance
    });

  } catch (err: any) {
    console.error("checkInWithQR error:", err);
    return res.status(400).json({ success: false, message: err.message || "Check-in failed" });
  }
};

/**
 * QR check-out controller
 */
export const checkOutWithQR = async (req: Request, res: Response) => {
  try {
    const teacherIdFromToken = (req as any).user?.id;
    const { classroomCode, teacherId: teacherIdFromBody, lat, lng } = req.body;

    const teacherId = teacherIdFromBody;
    if (!classroomCode || !teacherId) {
      return res.status(400).json({ success: false, message: "classroomCode & teacherId required" });
    }
    console.log(teacherId)
     
    const classroom = await Classroom.findOne({ code: classroomCode }) as IClassroom | null;
    if (!classroom) {
      return res.status(404).json({ success: false, message: "Invalid classroom QR" });
    }

    const teacher = await Teacher.findById(teacherId) as ITeacher | null;
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const isAssigned = teacher.classIds?.some(id => id.toString() === classroom._id.toString());
    if (!isAssigned) {
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
      performedBy: (req as any).user?.id || teacherId
    });

    return res.status(200).json({
      success: true,
      message: "Check-out successful",
      data: attendance
    });

  } catch (err: any) {
    console.error("checkOutWithQR error:", err);
    return res.status(400).json({ success: false, message: err.message || "Check-out failed" });
  }
};
