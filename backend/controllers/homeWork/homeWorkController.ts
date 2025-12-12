import { Request, Response } from "express";
import Homework from "../../models/HomeWork/homeWork";
import Class from "../../models/Class";
import Student from "../../models/Student";

export const createHomework = async (req: Request, res: Response):Promise<void>=> {
  try {
    const {
      classId,
      subject,
      teacherId,
      title,
      description,
      dueDate,
      attachment,
    }: {
      classId: string;
      subject: string;
      teacherId: string;
      title: string;
      description?: string;
      dueDate: string | Date;
      attachment?: string;
    } = req.body;

    // 1. Check if class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      res.status(404).json({ message: "Class not found" });
      return;
    }

    // 2. Create homework
    const homework = await Homework.create({
      classId,
      subject,
      teacherId,
      title,
      description,
      dueDate,
      attachment,
    });

    // 3. Parents notification logic (future implementation)

    res.status(201).json({
      message: "Homework assigned successfully",
      homework,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


export const getClassHomework = async (req: Request, res: Response): Promise<void> => {
  try {
    //const { classId } = req.params;

    // const startOfDay = new Date();
    // startOfDay.setHours(0, 0, 0, 0);

    // const endOfDay = new Date();
    // endOfDay.setHours(23, 59, 59, 999);

    const homework = await Homework.find()
      //classId,
    //   createdAt: {
    //     $gte: startOfDay,
    //     $lte: endOfDay
    //   }
    // }).sort({ createdAt: -1 });

    res.status(200).json(homework);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



export const getTeacherHomework = async (req:Request, res:Response) => {
  try {
    const { teacherId } = req.params;
    const homeworks = await Homework.find({ teacherId }).sort({ createdAt: -1 });
    res.status(200).json(homeworks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};