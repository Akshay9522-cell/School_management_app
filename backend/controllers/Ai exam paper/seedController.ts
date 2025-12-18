import { Request, Response } from "express";

import AcademicClass from "../../models/AI exam paper Generator/AcademicClass";
import Subject from "../../models/AI exam paper Generator/Subject";
import Chapter from "../../models/AI exam paper Generator/Chapter";
import Question from "../../models/AI exam paper Generator/Question";
import ExamPattern from "../../models/AI exam paper Generator/ExamPattern";

// Seed Board

export const seedAcademicClass = async (req: Request, res: Response) => {
  const { board, className } = req.body;
  const ac = await AcademicClass.create({ board, className });
  res.json(ac);
};

// Seed Subject
export const seedSubject = async (req: Request, res: Response) => {
  const { name, academicClass } = req.body;
   if (!name || !academicClass) {
      return res.status(400).json({
        message: "Subject name and academicClass are required",
      });
    }
  const subject = await Subject.create({ name, academicClass: academicClass });
  res.json(subject);
};

// Seed Chapter
export const seedChapter = async (req: Request, res: Response) => {
  const { name, chapterNumber, subject } = req.body;
  console.log(req.body)
      if (!name || !chapterNumber || !subject) {
      return res.status(400).json({
        message: "name, chapterNumber and subject are required",
      });
    }
  const chapter = await Chapter.create({ name, chapterNumber, subject: subject });
  res.json(chapter);
};

// Seed Question
export const seedQuestion = async (req: Request, res: Response) => {
    // console.log(req.body)
    // res.send('ok')
  const question = await Question.create(req.body);
  res.json(question);
};

// Seed ExamPattern
export const seedPattern = async (req: Request, res: Response) => {
  const pattern = await ExamPattern.create(req.body);
  res.json(pattern);
};