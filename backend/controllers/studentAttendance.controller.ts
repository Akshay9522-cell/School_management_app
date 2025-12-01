import { Request, Response } from "express";
import Attendance from "../models/Attendance";
import Student from "../models/Student";
import mongoose, { PipelineStage } from "mongoose";
import { toDateOnly } from "../utils/date";

/**
 * POST /api/attendance/mark
 * body: { classId, date, records: [{ studentId, status, note?}], force?: boolean }
 */
export const markAttendance = async (req: Request & { user?: any }, res: Response) => {
  const teacherId = req.user?.id;
  const { classId, date, records, force } = req.body;

  if (!classId || !date || !Array.isArray(records)) {
    return res.status(400).json({ message: "classId, date and records are required" });
  }

  const classObjId = new mongoose.Types.ObjectId(classId);
  const dateOnly = toDateOnly(date);

  try {
    let existing = await Attendance.findOne({ classId: classObjId, date: dateOnly });

    if (existing && existing.locked && !force) {
      return res.status(409).json({ message: "Attendance locked for this date" });
    }

    // sanitize records: ensure studentId and valid status
    const sanitized = (records as any[]).map((r) => ({
      studentId: new mongoose.Types.ObjectId(r.studentId),
      status: r.status,
      note: r.note || "",
    }));

    if (!existing) {
      const att = new Attendance({
        classId: classObjId,
        date: dateOnly,
        markedBy: new mongoose.Types.ObjectId(teacherId),
        records: sanitized,
      });

      await att.save();
      return res.status(201).json({ success: true, attendance: att });
    }

    // update existing
    existing.records = sanitized;
    existing.markedBy = new mongoose.Types.ObjectId(teacherId);
    await existing.save();
    return res.json({ success: true, attendance: existing });
  } catch (err: any) {
    // handle duplicate key race condition
    if (err.code === 11000) {
      const dateOnlyRetry = toDateOnly(date);
      const existingRetry = await Attendance.findOne({ classId: classObjId, date: dateOnlyRetry });
      if (existingRetry) {
        existingRetry.records = (records as any[]).map((r) => ({
          studentId: new mongoose.Types.ObjectId(r.studentId),
          status: r.status,
          note: r.note || "",
        }));
        existingRetry.markedBy = new mongoose.Types.ObjectId(teacherId);
        await existingRetry.save();
        return res.json({ success: true, attendance: existingRetry });
      }
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/attendance?classId=...&date=YYYY-MM-DD
 * returns attendance doc if exists, else returns students skeleton
 */
export const getAttendanceByClassDate = async (req: Request, res: Response) => {
  const { classId, date } = req.query;
  if (!classId || !date) return res.status(400).json({ message: "classId and date required" });

  const dateOnly = toDateOnly(String(date));
  try {
    const att = await Attendance.findOne({ classId, date: dateOnly }).populate("records.studentId", "name rollNo");
    if (!att) {
      // return students list so frontend can show skeleton (no attendance yet)
      const students = await Student.find({ classId }).select("_id name rollNo");
      return res.json({ attendance: null, students });
    }
    return res.json({ attendance: att });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/attendance/summary?classId=...&from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns basic present/absent counts per class across date range
 */
export const attendanceSummary = async (req: Request, res: Response) => {
  const { classId, from, to, studentId } = req.query;
  if (!classId || !from || !to) return res.status(400).json({ message: "classId, from and to required" });

  const classObjId = new mongoose.Types.ObjectId(String(classId));
  const fromDate = toDateOnly(String(from));
  const toDate = toDateOnly(String(to));

  try {
    // aggregate present count and total records
    const pipeline: any[] = [
      { $match: { classId: classObjId, date: { $gte: fromDate, $lte: toDate } } },
      { $unwind: "$records" },
      // optional filter by studentId
      ...(studentId ? [{ $match: { "records.studentId": new mongoose.Types.ObjectId(String(studentId)) } }] : []),
      {
        $group: {
          _id: "$records.status",
          count: { $sum: 1 },
        },
      },
    ];

    const result = await Attendance.aggregate(pipeline);
    // convert to friendly object
    const summary: any = {};
    result.forEach((r: any) => (summary[r._id] = r.count));
    return res.json({ summary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/attendance/student/:studentId?from=...&to=...
 * Returns attendance entries for a student between dates (day-level)
 */
export const getStudentAttendance = async (req: Request, res: Response) => {
  const { date, startDate, endDate, studentId } = req.params;
  const { from, to } = req.query;
  if (!studentId || !from || !to) return res.status(400).json({ message: "studentId, from and to required" });

  const fromDate = toDateOnly(String(from));
  const toDate = toDateOnly(String(to));

 

// If only one date is passed → use that day
let start = startDate ? new Date(startDate as string) : new Date(date as string);
let end = endDate ? new Date(endDate as string) : new Date(date as string);

// Set time to cover whole day
start.setHours(0, 0, 0, 0);
end.setHours(23, 59, 59, 999);


  try {
   const pipeline: PipelineStage[] = [
  {
    $match: {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    },
  },
  {
    $unwind: "$records",
  },
  {
    $match: {
      "records.studentId": studentId ? new mongoose.Types.ObjectId(studentId) : { $exists: true }
    },
  },
  {
    $project: {
      date: 1,
      status: "$records.status",
      note: "$records.note",
    },
  },
  {
    $sort: { date: -1 },
  },
];

const result = await Attendance.aggregate(pipeline);
    return res.json({ result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAttendanceSummary = async (req: Request, res: Response) => {
  try {
    const { classId, studentId, startDate, endDate } = req.query;

    if (!classId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "classId, startDate and endDate are required",
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(classId as string)) {
      return res.status(400).json({ success: false, message: "Invalid classId" });
    }

    const start = new Date(String(startDate));
    start.setHours(0, 0, 0, 0);
    const end = new Date(String(endDate));
    end.setHours(23, 59, 59, 999);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          classId: new mongoose.Types.ObjectId(String(classId)),
          date: { $gte: start, $lte: end },
        },
      },
      { $unwind: "$records" },
      ...(studentId
        ? [
            {
              $match: {
                "records.studentId": new mongoose.Types.ObjectId(String(studentId)),
              },
            },
          ]
        : []),
      {
        $lookup: {
          from: "students",
          localField: "records.studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $project: {
          date: 1,
          studentName: "$student.name",
          status: "$records.status",
          note: "$records.note",
        },
      },
      { $sort: { date: -1, studentName: 1 } },
    ];

    const summary = await Attendance.aggregate(pipeline);

    const present = summary.filter((s) => s.status.toLowerCase() === "present").length;
    const total = summary.length;
    const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

    return res.status(200).json({
      success: true,
      summary,
      stats: { present, total, percentage },
    });
  } catch (err: any) {
    console.error("Attendance Summary Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};