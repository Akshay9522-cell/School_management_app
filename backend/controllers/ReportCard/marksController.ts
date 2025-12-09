import { Request, Response } from "express";
import Mark from "../../models/Report card/marksModel";

// Add marks
export const addMark = async (req: Request, res: Response) => {
  try {
    const mark = await Mark.create(req.body);
    res.status(201).json({ success: true, data: mark });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update marks
export const updateMark = async (req: Request, res: Response) => {
  try {
    const mark = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mark) return res.status(404).json({ success: false, message: "Mark not found" });
    res.json({ success: true, data: mark });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get marks by student & exam
export const getMarksByStudentExam = async (req: Request, res: Response) => {
  const { studentId, examId } = req.params;
  const marks = await Mark.find({ studentId, examId })
    .populate("subjectId", "name code type")
    .populate("classId", "name section");
  res.json({ success: true, data: marks });
};

// Get all marks for a class + exam
export const getMarksByClassExam = async (req: Request, res: Response) => {
  const { classId, examId } = req.params;
  const marks = await Mark.find({ classId, examId })
    .populate("studentId", "name rollNo")
    .populate("subjectId", "name code type");
  res.json({ success: true, data: marks });
};
