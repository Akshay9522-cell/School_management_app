import { Request, Response } from "express";
import Classroom from "../models/classroom";
import { Types } from "mongoose";

// Add new classroom
export const addClassroom = async (req: Request, res: Response) => {
  try {
    const { name, code, location } = req.body;

    // Check for duplicate code
    const existing = await Classroom.findOne({ code });
    if (existing) {
      return res.status(400).json({ success: false, message: "Classroom code already exists" });
    }

    const classroom = await Classroom.create({
      name,
      code,
      location,
    });

    res.status(201).json({ success: true, data: classroom });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || String(err) });
  }
};

// Get all classrooms
export const getClassrooms = async (req: Request, res: Response) => {
  try {
    const classrooms = await Classroom.find().lean();
    res.status(200).json({ success: true, data: classrooms });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || String(err) });
  }
};

// Get classroom by ID
export const getClassroomById = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findById(req.params.id).lean();
    if (!classroom) return res.status(404).json({ success: false, message: "Classroom not found" });
    res.status(200).json({ success: true, data: classroom });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || String(err) });
  }
};

// Update classroom
export const updateClassroom = async (req: Request, res: Response) => {
  try {
    const { name, code, location } = req.body;
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      { name, code, location },
      { new: true }
    );
    if (!classroom) return res.status(404).json({ success: false, message: "Classroom not found" });
    res.status(200).json({ success: true, data: classroom });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || String(err) });
  }
};

// Delete classroom
export const deleteClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!classroom) return res.status(404).json({ success: false, message: "Classroom not found" });
    res.status(200).json({ success: true, message: "Classroom deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || String(err) });
  }
};
