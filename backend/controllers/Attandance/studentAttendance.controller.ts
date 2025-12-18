import { Request, Response } from "express";
import Attendance from "../../models/Attendance";
import Student from "../../models/Student";
import mongoose, { PipelineStage } from "mongoose";
import { toDateOnly } from "../../utils/date";

/**
 * POST /api/attendance/mark
 * body: { classId, date, records: [{ studentId, status, note? }], force?: boolean }
 */
export const markAttendance = async (
  req: Request & { user?: any },
  res: Response
) => {
  const teacherId = req.user?.id;
  const { classId, date, records, force } = req.body;

  if (!classId || !date || !Array.isArray(records)) {
    return res
      .status(400)
      .json({ message: "classId, date and records are required" });
  }

  const classObjId = new mongoose.Types.ObjectId(classId);
  const dateOnly = toDateOnly(date);

  try {
    let existing = await Attendance.findOne({
      classId: classObjId,
      date: dateOnly,
    });

    if (existing && existing.locked && !force) {
      return res
        .status(409)
        .json({ message: "Attendance locked for this date" });
    }

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

    existing.records = sanitized;
    existing.markedBy = new mongoose.Types.ObjectId(teacherId);
    await existing.save();
    return res.json({ success: true, attendance: existing });
  } catch (err: any) {
    if (err.code === 11000) {
      const dateOnlyRetry = toDateOnly(date);
      const existingRetry = await Attendance.findOne({
        classId: classObjId,
        date: dateOnlyRetry,
      });
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
export const getAttendanceByClassDate = async (
  req: Request,
  res: Response
) => {
  const { classId, date } = req.query;
  if (!classId || !date) {
    return res
      .status(400)
      .json({ message: "classId and date required" });
  }

  const dateOnly = toDateOnly(String(date));
  try {
    const att = await Attendance.findOne({
      classId,
      date: dateOnly,
    }).populate("records.studentId", "name rollNo");

    if (!att) {
      const students = await Student.find({ classId }).select(
        "_id name rollNo"
      );
      return res.json({ attendance: null, students });
    }
    return res.json({ attendance: att });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/attendance/summary?classId=...&date=YYYY-MM-DD&studentId=...
 */
export const attendanceSummary = async (req: Request, res: Response) => {
  try {
    const { classId, studentId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({
        success: false,
        message: "classId and date are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(String(classId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid classId",
      });
    }

    const classObjId = new mongoose.Types.ObjectId(String(classId));

    function parseDateOnly(d: string) {
      const p = d.split("-");
      return new Date(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2])));
    }

    const inputDate = parseDateOnly(String(date));

    const start = new Date(inputDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(inputDate);
    end.setUTCHours(23, 59, 59, 999);

    const pipeline: any[] = [
      {
        $match: {
          classId: classObjId,
          date: { $gte: start, $lte: end },
        },
      },
      { $unwind: "$records" },

      ...(studentId
        ? [
            {
              $match: {
                "records.studentId": new mongoose.Types.ObjectId(
                  String(studentId)
                ),
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
          _id: 0,
          studentId: "$student._id",
          studentName: "$student.name",
          status: "$records.status",
          note: "$records.note",
        },
      },
    ];

    const result = await Attendance.aggregate(pipeline);

    const summary = {
      present: result.filter((d: any) => d.status === "present").length,
      absent: result.filter((d: any) => d.status === "absent").length,
    };

    return res.json({
      success: true,
      summary,
      result,
    });
  } catch (err) {
    console.error("Attendance Summary Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * GET /api/attendance/student/:studentId?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export const getStudentAttendance = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { from, to } = req.query;

  if (!studentId || !from || !to) {
    return res
      .status(400)
      .json({ message: "studentId, from and to required" });
  }

  const fromDate = toDateOnly(String(from));
  const toDate = toDateOnly(String(to));

  const start = new Date(fromDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(toDate);
  end.setHours(23, 59, 59, 999);

  try {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      { $unwind: "$records" },
      {
        $match: {
          "records.studentId": new mongoose.Types.ObjectId(studentId),
        },
      },
      {
        $project: {
          date: 1,
          status: "$records.status",
          note: "$records.note",
        },
      },
      { $sort: { date: -1 } },
    ];

    const result = await Attendance.aggregate(pipeline);
    return res.json({ result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
