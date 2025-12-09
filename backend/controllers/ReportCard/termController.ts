import termModel from "../../models/Report card/term.model";
import { Request, Response } from "express";
import Exam from '../../models/Report card/exam.model'
import DateSheet from '../../models/Report card/datesheet.model'

export const createTerm = async (req:Request, res:Response) => {
  try {
    const term = await termModel.create(req.body);
    console.log(req.body)
    res.status(201).json({ success: true, data: term });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
export const getTerms = async (req:Request, res:Response) => {
  const terms = await termModel.find();
  res.json({ success: true, data: terms });
};

export const createExam = async (req:Request, res:Response) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
export const getAllExams = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.find();
    res.status(200).json({ success: true, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getExamsByTerm = async (req:Request, res:Response) => {
  const exams = await Exam.find({ termId: req.params.termId });
  res.json({ success: true, data: exams });
};
export const addDateSheet = async (req:Request, res:Response) => {
  try {
    const ds = await DateSheet.create(req.body);
    res.status(201).json({ success: true, data: ds });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
export const getDateSheet = async (req:Request, res:Response) => {
  const { examId, classId } = req.params;

  const ds = await DateSheet.find({ examId, classId })
    .populate("subjectId", "name code type");

  res.json({ success: true, data: ds });
};
