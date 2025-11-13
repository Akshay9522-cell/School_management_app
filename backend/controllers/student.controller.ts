import { Request, Response } from "express";
import { addStudentService, getStudentsService } from "../services/student.service";
import { getStudentByIdService } from "../services/student.service";
import { updateStudentService } from "../services/student.service";

export const addStudent = async (req: Request, res: Response) => {
  try {
    const student = await addStudentService(req.body);
    res.status(201).json({ success: true, student });
  } catch (error) {
    res.status(400).json({ success: false, msg: "Error adding student" });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await getStudentsService();
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};



export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await getStudentByIdService(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await updateStudentService(req.params.id, req.body);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};