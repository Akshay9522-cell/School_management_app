import mongoose from "mongoose";
import Teacher from "../models/Teacher";

type TeacherQuery = {
  page?: any;
  limit?: any;
  search?: string;
  subject?: string;
  classIds?:string[];
  sort?: string; // e.g. "name:asc" or "joiningDate:desc"
};

// Add teacher
export const addTeacherService = async (data: any) => {
  return await Teacher.create(data);
};

// Get teachers with filters, pagination, and sorting
export const getTeachersService = async (query: TeacherQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters: any = {};

  if (query.search) {
    filters.name = { $regex: query.search, $options: "i" };
  }

  if (query.subject) {
    filters.subject = { $regex: query.subject, $options: "i" };
  }

  // FIX: multiple class filter
if (query.classIds && query.classIds.length > 0) {
  filters.classIds = { 
    $in: query.classIds.map(id => new mongoose.Types.ObjectId(id))
  };
} 
  const teachers = await Teacher.find(filters)
    .populate("classIds")
    .skip(skip)
    .limit(limit);

  const total = await Teacher.countDocuments(filters);

  return {
    success: true,
    data:teachers,
   pagination: {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit), // total pages
  },
  };
};


export const assignClassToTeacher = async (teacherId: string, classId: string[]) => {
  return Teacher.findByIdAndUpdate(
    teacherId,
    { $addToSet: { classIds: classId } }, // ⬅ Prevent duplicates
    { new: true }
  ).populate("classIds");
};

export const removeClassFromTeacher = async (teacherId: string, classId: string) => {
  return Teacher.findByIdAndUpdate(
    teacherId,
    { $pull: { classIds: classId } },
    { new: true }
  ).populate("classIds");
};

// Assign subject to a teacher
export const assignSubjectService = async (id: string, subject: string) => {
  return await Teacher.findByIdAndUpdate(
    id,
    { subject },
    { new: true }
  ).lean();
};

// Assign class to a teacher
export const assignClassService = async (id: string, classId: string[]) => {
  return await Teacher.findByIdAndUpdate(
    id,
    { $addToSet: { classIds: { $each: classId } } }, // Add multiple without duplicates
    { new: true }
  ).populate("classIds").lean();
};

// Get teacher by ID
export const getTeacherByIdService = async (id: string) => {
  return await Teacher.findById(id).lean();
};

// Update teacher
export const updateTeacherService = async (id: string, data: any) => {
  return await Teacher.findByIdAndUpdate(id, data, { new: true }).lean();
};

// Delete teacher
export const deleteTeacherService = async (id: string) => {
  return await Teacher.findByIdAndDelete(id);
};
