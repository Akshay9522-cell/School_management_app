
import User from '../models/User'
import Teacher from '../models/Teacher';
import { Request, Response } from "express";
import {
 
  getTeachersService,
  getTeacherByIdService,
  updateTeacherService,
  deleteTeacherService,
  assignSubjectService,
  assignClassService,
} from "../services/teacherService";
import { getClassByIdService } from "../services/classService";
import bcrypt from 'bcryptjs';

// Add Teacher
export const addTeacher = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, phone, qualification, classIds } = req.body;

    // 1️⃣ Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create user with DEFAULT PASSWORD
      const hashed = await bcrypt.hash("teacher123", 10);

      user = await User.create({
        name,
        email,
        password: hashed,
        role: "teacher",
      });
    } else {
      // Ensure user role becomes teacher
      user.role = "teacher";
  user.password = await bcrypt.hash("teacher123", 10); // 🔥 FIX
  await user.save();
    }

    // 2️⃣ Check if teacher profile exists
    let teacher = await Teacher.findOne({ userId: user._id });

    if (!teacher) {
      teacher = await Teacher.create({
        userId: user._id,
        name,
        email,
        subject,
        phone,
        qualification,
        classIds,
      });
    } else {
      teacher.name = name;
      teacher.email = email;
      teacher.subject = subject;
      teacher.phone = phone;
      teacher.qualification = qualification;
      teacher.classIds = classIds || teacher.classIds;
      await teacher.save();
    }

    res.status(201).json({
      success: true,
      message: "Teacher created/updated successfully. Default password = teacher123",
      data: { user, teacher },
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const role = (req.query.role as string)?.trim();  
   
    // Validate
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required in query parameter",
      });
    }

    // Fetch from DB
    const users = await User.find({ role });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};



// Get Teachers
export const getTeachers = async (req: Request, res: Response) => {
  try {
    // If request asks for all teachers
      
    // if (req.query.all === "true") {
    //   const teachers = await getTeachersService({ all: true });

    //   return res.status(200).json({
    //     success: true,
    //     data: teachers.data, // assuming service returns { data, pagination? }
    //   });
    // }

    // Paginated request
    const result = await getTeachersService(req.query as any);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
        ? {
            page: result.pagination.page,
            limit: result.pagination.limit,
            total: result.pagination.total,
            pages: result.pagination.pages,
          }
        : undefined,
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
