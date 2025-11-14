import { Request, Response } from "express";
import {addTeacherService,getTeachersService,getTeacherByIdService, updateTeacherService,deleteTeacherService,} from "../services/teacherService";

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

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const result = await getTeachersService(req.query);
    res.status(200).json({
      success: true,
      message: "Teachers fetched successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await updateTeacherService(req.params.id, req.body);
    if (!teacher)
      return res.status(404).json({ success: false, message: "Teacher not found" });

    res.status(200).json({ success: true, message: "Teacher updated", data: teacher });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await deleteTeacherService(req.params.id);
    if (!teacher)
      return res.status(404).json({ success: false, message: "Teacher not found" });

    res.status(200).json({ success: true, message: "Teacher deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
