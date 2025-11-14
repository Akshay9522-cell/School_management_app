import { Request, Response } from "express";
import {
  addStudentService,
  getStudentsService,
  getStudentByIdService,
  updateStudentService,
  deleteStudentService,
} from "../services/student.service";

export const addStudent = async (req: Request, res: Response) => {
  try {
    const student = await addStudentService(req.body);
    res.status(201).json({ success: true, message: "Student added successfully", student });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(400).json({ success: false, message: "Error adding student", error });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const result = await getStudentsService(req.query);
    res.status(200).json({
      success: true,
      total: result.total,
      currentPage: result.page,
      totalPages: result.pages,
      perPage: result.limit,
      sort: result.sort,
      filters: result.filtersUsed,
      data: result.students,
      
    });
    console.log(result)
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await getStudentByIdService(req.params.id);
    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await updateStudentService(req.params.id, req.body);
    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await deleteStudentService(req.params.id);
    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
