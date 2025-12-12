// controllers/dailyReportController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import HomeworkStatus from "../../models/HomeWork/DailyHomeWork";
import TestResult from "../../models/Tests/TestResult";
import { toDateOnly } from "../../utils/date";

export const submitDailyReport = async (
  req: Request & { user?: any },
  res: Response
) => {
  const teacherId = req.user?.id;
  const { classId, date, homework, tests } = req.body;

  if (!classId || !date) {
    return res
      .status(400)
      .json({ success: false, message: "classId and date are required" });
  }

  if (!Array.isArray(homework)) {
    return res
      .status(400)
      .json({ success: false, message: "homework must be an array" });
  }

  const classObjId = new mongoose.Types.ObjectId(classId);
  const dateOnly = toDateOnly(date);

  try {
    // 1) Upsert homework for that class + date
    const hwRecords = homework.map((h: any) => ({
      studentId: new mongoose.Types.ObjectId(h.studentId),
      status: h.status === "complete" ? "complete" : "incomplete",
    }));

    await HomeworkStatus.findOneAndUpdate(
      { classId: classObjId, date: dateOnly },
      {
        $set: {
          classId: classObjId,
          date: dateOnly,
          markedBy: new mongoose.Types.ObjectId(teacherId),
          records: hwRecords,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 2) Save tests only if provided and non-empty
    if (Array.isArray(tests) && tests.length > 0) {
      for (const t of tests) {
        if (
          !t.subject ||
          typeof t.totalMarks !== "number" ||
          !Array.isArray(t.records)
        ) {
          continue;
        }

        const testRecords = t.records.map((r: any) => ({
          studentId: new mongoose.Types.ObjectId(r.studentId),
          marks: Number(r.marks),
        }));

        const testDoc = new TestResult({
          classId: classObjId,
          subject: t.subject,
          date: dateOnly,
          totalMarks: t.totalMarks,
          records: testRecords,
        });

        await testDoc.save();
      }
    }

    return res.json({
      success: true,
      message: "Daily report saved successfully",
    });
  } catch (err) {
    console.error("submitDailyReport error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};
