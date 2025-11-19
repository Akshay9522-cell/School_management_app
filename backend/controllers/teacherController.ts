import { Request, Response } from "express";
import {
  addTeacherService,
  getTeachersService,
  getTeacherByIdService,
  updateTeacherService,
  deleteTeacherService,
  assignSubjectService,
  assignClassService,
} from "../services/teacherService";
import { getClassByIdService } from "../services/classService";

// Add Teacher
export const addTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await addTeacherService(req.body);
    res.status(201).json({
      success: true,
      message: "Teacher added successfully",
      data: teacher,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Teachers
export const getTeachers = async (req: Request, res: Response) => {
  try {
    const result = await getTeachersService(req.query);
   res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        page: result.pagination.page,                // page from result
        limit: result.pagination.limit,              // limit from result
        total: result.pagination.total,              // total from result
        pages: Math.ceil(result.pagination.total / result.pagination.limit), // calculate total pages
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign Multiple Classes
export const updateTeacherClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;  // teacherId
    const { classIds } = req.body;
    console.log(id,classIds)

    // Validate array
    if (!Array.isArray(classIds)) {
      return res.status(400).json({
        success: false,
        message: "classIds must be an array of class IDs",
      });
    }

    // Validate each class ID exists
    for (const classId of classIds) {
      const exists = await getClassByIdService(classId);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: `Class not found: ${classId}`,
        });
      }
    }

    // Update teacher
    const updatedTeacher = await assignClassService(id, classIds);

    if (!updatedTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Classes assigned successfully",
      data: updatedTeacher,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Assign Subject
export const updateTeacherSubject = async (req: Request, res: Response) => {
  try {
    const { subject } = req.body;
    const teacher = await assignSubjectService(req.params.id, subject);

    res.status(200).json({
      success: true,
      message: "Subject assigned successfully",
      data: teacher,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Teacher by ID
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacher = await getTeacherByIdService(req.params.id);
    if (!teacher)
      return res.status(404).json({ success: false, message: "Teacher not found" });

    res.status(200).json({ success: true, data: teacher });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Teacher
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await updateTeacherService(req.params.id, req.body);
    if (!teacher)
      return res.status(404).json({ success: false, message: "Teacher not found" });

    res.status(200).json({
      success: true,
      message: "Teacher updated",
      data: teacher,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Teacher
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await deleteTeacherService(req.params.id);
    if (!teacher)
      return res.status(404).json({ success: false, message: "Teacher not found" });

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
