import Attendance from "../models/Attendance";
import HomeworkStatus from "../models/HomeWork/DailyHomeWork";
import TestResult from "../models/Tests/TestResult";
import Student from "../models/Student";

/* ---------- Types ---------- */
export interface StudentWeeklySummary {
  studentId: string;
  name: string;
  parentPhone: string;
  attendance: {
    presentDays: number;
    totalDays: number;
    percentage: number;
  };
  homework: {
    completeDays: number;
    totalDays: number;
    percentage: number;
  };
  tests: {
    subject: string;
    totalTests: number;
    averageScore: number;
    lastTestMarks: number;
    lastTestTotal: number;
  }[];
}

export interface ClassWeeklyReport {
  classId: string;
  start: string;
  end: string;
  students: StudentWeeklySummary[];
}

/* ---------- Service ---------- */
export async function buildClassWeeklyReport(
  classId: string,
  start: string,
  end: string
): Promise<ClassWeeklyReport> {

  const startDate = new Date(start);
  const endDate = new Date(end);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const students = await Student.find({ classId })
    .select("_id name parentPhone")
    .lean();

  const attendanceMap: Record<string, any> = {};
  const homeworkMap: Record<string, any> = {};
  const testsMap: Record<string, any> = {};

  /* ---------- Attendance ---------- */
  const attendanceDocs = await Attendance.find({
    classId,
    date: { $gte: startDate, $lte: endDate },
  }).lean();

  for (const doc of attendanceDocs) {
    for (const rec of doc.records) {
      const sid = String(rec.studentId);
      attendanceMap[sid] ??= { presentDays: 0, totalDays: 0 };
      attendanceMap[sid].totalDays++;
      if (rec.status === "present") attendanceMap[sid].presentDays++;
    }
  }

  /* ---------- Homework ---------- */
  const homeworkDocs = await HomeworkStatus.find({
    classId,
    date: { $gte: startDate, $lte: endDate },
  }).lean();

  for (const doc of homeworkDocs) {
    for (const rec of doc.records) {
      const sid = String(rec.studentId);
      homeworkMap[sid] ??= { completeDays: 0, totalDays: 0 };
      homeworkMap[sid].totalDays++;
      if (rec.status === "complete") homeworkMap[sid].completeDays++;
    }
  }

  /* ---------- Tests ---------- */
  const testDocs = await TestResult.find({
    classId,
    date: { $gte: startDate, $lte: endDate },
  }).lean();

  for (const test of testDocs) {
    for (const rec of test.records) {
      const sid = String(rec.studentId);
      testsMap[sid] ??= {};
      testsMap[sid][test.subject] ??= {
        totalTests: 0,
        totalScore: 0,
        lastTestMarks: 0,
        lastTestTotal: test.totalMarks,
        lastTestDate: test.date,
      };

      const entry = testsMap[sid][test.subject];
      entry.totalTests++;
      entry.totalScore += rec.marks;

      if (new Date(test.date) >= new Date(entry.lastTestDate)) {
        entry.lastTestMarks = rec.marks;
        entry.lastTestTotal = test.totalMarks;
        entry.lastTestDate = test.date;
      }
    }
  }

  const studentSummaries: StudentWeeklySummary[] = students.map((stu) => {
    const sid = String(stu._id);
    const att = attendanceMap[sid] || { presentDays: 0, totalDays: 0 };
    const hw = homeworkMap[sid] || { completeDays: 0, totalDays: 0 };

    return {
      studentId: sid,
      name: stu.name,
      parentPhone: stu.parentPhone,
      attendance: {
        ...att,
        percentage: att.totalDays
          ? Number(((att.presentDays / att.totalDays) * 100).toFixed(2))
          : 0,
      },
      homework: {
        ...hw,
        percentage: hw.totalDays
          ? Number(((hw.completeDays / hw.totalDays) * 100).toFixed(2))
          : 0,
      },
      tests: Object.entries(testsMap[sid] || {}).map(
        ([subject, t]: any) => ({
          subject,
          totalTests: t.totalTests,
          averageScore: Number((t.totalScore / t.totalTests).toFixed(2)),
          lastTestMarks: t.lastTestMarks,
          lastTestTotal: t.lastTestTotal,
        })
      ),
    };
  });

  return {
    classId,
    start,
    end,
    students: studentSummaries,
  };
}
