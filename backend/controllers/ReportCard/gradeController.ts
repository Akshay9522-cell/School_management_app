import { Request, Response } from "express";
import Mark from "../../models/Report card/marksModel";
import { calculateGrade } from "../../utils/grade";

export const getReportCardByStudent = async (req: Request, res: Response) => {
  const { studentId, examId } = req.params;

  // Fetch marks
  const marks = await Mark.find({ studentId, examId })
    .populate("subjectId", "name code type")
    .populate("classId", "name section");

  if (!marks || marks.length === 0) {
    return res.status(404).json({ success: false, message: "No marks found" });
  }

  // Calculate totals
  let totalObtained = 0;
  let totalMax = 0;
  const subjects = marks.map((m) => {
    totalObtained += m.marksObtained;
    totalMax += m.maxMarks;
    const percentage = (m.marksObtained / m.maxMarks) * 100;
    const grade = calculateGrade(percentage);
    return {
      subject: m.subjectId as unknown as{name:string}   ,
      marksObtained: m.marksObtained,
      maxMarks: m.maxMarks,
      percentage: percentage.toFixed(2),
      grade,
    };
  });

  const overallPercentage = ((totalObtained / totalMax) * 100).toFixed(2);
  const overallGrade = calculateGrade(Number(overallPercentage));

  res.json({
    success: true,
    data: {
      studentId,
      examId,
      subjects,
      totalObtained,
      totalMax,
      overallPercentage,
      overallGrade,
    },
  });
};
