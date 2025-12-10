// controllers/reportController.ts
import { Request, Response } from "express";
import Student from "../../models/Student";

function calcGrade(percentage: number) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

export const addReportToStudent = async (req: Request, res: Response) => {
  try {
    const { studentId, term, marks } = req.body;

    if (!studentId) return res.status(400).json({ message: "studentId required" });
    if (!Array.isArray(marks) || marks.length === 0) return res.status(400).json({ message: "marks required" });

    // Normalize & compute per-mark derived fields
    const computedMarks = marks.map((m: any) => {
      const total = Number(m.totalMarks ?? 100);
      const practical = Number(m.practicalMarks ?? 0);
      const theory = Number(m.theoryMarks ?? 0);
      const obtained = practical + theory;
      const percentage = total > 0 ? (obtained / total) * 100 : 0;
      const grade = calcGrade(percentage);
      const status = percentage >= 50 ? "PASS" : "FAIL";
      return {
        subject: String(m.subject ?? "").trim(),
        totalMarks: total,
        practicalMarks: practical,
        theoryMarks: theory,
        obtained,
        percentage: Number(percentage.toFixed(2)),
        grade,
        status,
      };
    });

    const overallPercentage =
      computedMarks.reduce((s: number, mm: any) => s + mm.percentage, 0) / computedMarks.length;

    const overallGrade = calcGrade(overallPercentage);
    const passRate = computedMarks.filter((mm: any) => mm.status === "PASS").length;

    const reportData = {
      term: term ?? `Term - ${new Date().toISOString()}`,
      createdAt: new Date(),
      marks: computedMarks,
      overallPercentage: Number(overallPercentage.toFixed(2)),
      overallGrade,
      passRate,
    };

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.reports = student.reports ?? [];
    student.reports.push(reportData);

    await student.save();

    return res.json({ success: true, message: "Report added", report: reportData });
  } catch (err) {
    console.error("addReportToStudent error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
