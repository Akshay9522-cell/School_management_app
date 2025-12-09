import { Request, Response } from "express";
import Subject from "../../models/Report card/Subject";

export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name, classId, maxMarks } = req.body;

    if (!name || !classId) {
      return res.status(400).json({ success: false, message: "Name and classId required" });
    }

    const subject = await Subject.create({ name, classId, maxMarks });

    return res.json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getSubjectsByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;

    const subjects = await Subject.find({ classId });

    return res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.params;
    const { name, maxMarks } = req.body;

    const updated = await Subject.findByIdAndUpdate(
      subjectId,
      { name, maxMarks },
      { new: true }
    );

    return res.json({ success: true, subject: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.params;

    await Subject.findByIdAndDelete(subjectId);

    return res.json({ success: true, message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
