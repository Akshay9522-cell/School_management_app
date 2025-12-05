import { Request, Response } from "express";
import {
  addStudentService,
  getStudentsService,
  getStudentByIdService,
  updateStudentService,
  deleteStudentService,
} from "../services/student.service";
import Student from "../models/Student";

// ---------------- ADD STUDENT --------------------
export const addStudent = async (req: Request, res: Response) => {
  try {
    const student = await addStudentService(req.body);
    console.log(student)
    return res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: student,
    });
  } catch (error: any) {
    console.error("Error adding student:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to add student",
    });
  }
};

// ---------------- GET ALL STUDENTS --------------------
export const getStudents = async (req: Request, res: Response) => {
  try {
    const result = await getStudentsService(req.query);

    return res.status(200).json({
      success: true,
      pagination: {
        total: result.total,
        currentPage: result.page,
        totalPages: result.pages,
        perPage: result.limit,
      },
      sort: result.sort,
      filters: result.filtersUsed,
      data: result.students,
    });
  } catch (error: any) {
    console.error("Error fetching students:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// ---------------- GET STUDENT BY ID --------------------
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await getStudentByIdService(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error: any) {
    console.error("Error fetching student:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student",
    });
  }
};

// ---------------- UPDATE STUDENT --------------------
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await updateStudentService(req.params.id, req.body);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error: any) {
    console.error("Error updating student:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update student",
    });
  }
};

// ---------------- DELETE STUDENT --------------------
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await deleteStudentService(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting student:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete student",
    });
  }
};

export const assignBusToRouteStudents = async (req:Request, res:Response  ) => {
  try {
    const { routeId, busId } = req.body;

    // Update all students of this route
    await Student.updateMany(
      { routeId },
      { busId: busId, isBusAssigned: true }
    );

    return res.json({
      success: true,
      message: "Bus assigned to all students of the route"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};