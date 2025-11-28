import { Request, Response } from "express";
import Attendance from "../models/attandance/TeacherAttendance";
import Teacher from "../models/Teacher";

export const attendanceSummary = async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string;
    if (!date) {
      return res.status(400).json({ success: false, message: "Date required" });
    }

    // 1️⃣ Fetch all attendance for the given date
    const attendances = await Attendance.find({ date })
      .populate("teacherId", "name email")
      .populate("classroomId", "name code");

    // 2️⃣ Separate into categories
    const present = [];
    const late = [];
    const absent = [];
    const missingCheckout = [];
    const completed = [];

    const teacherSet = new Set<string>(); // track who has attendance record

    // Categorize attendance
    for (const a of attendances) {
      const teacherId = String(a.teacherId?._id);
      teacherSet.add(teacherId);

      if (a.status === "LATE") late.push({ id: teacherId, teacher: a.teacherId });
      else if (a.status === "PRESENT") present.push({ id: teacherId, teacher: a.teacherId });

      if (a.checkInTime && !a.checkOutTime)
        missingCheckout.push({ id: teacherId, teacher: a.teacherId });

      if (a.checkInTime && a.checkOutTime)
        completed.push({ id: teacherId, teacher: a.teacherId });
    }

    // 3️⃣ Find all teachers (for ABSENT checking)
    const allTeachers = await Teacher.find({}, "name email _id");

    for (const t of allTeachers) {
      if (!teacherSet.has(String(t._id))) {
        absent.push({ id: String(t._id), teacher: t });
      }
    }

    // 4️⃣ Return final summary
    return res.json({
      success: true,
      data: {
        date,
        present,
        late,
        absent,
        missingCheckout,
        completed,
        attendances,
      },
    });
  } catch (err) {
    console.error("Summary error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error in summary",
    });
  }
};
