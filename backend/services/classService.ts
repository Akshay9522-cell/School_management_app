import mongoose from "mongoose";
import Class from "../models/Class";
import Teacher from "../models/Teacher";

type Query = {
  page?: string;
  limit?: string;
  search?: string;
  teacher?: string;
  sort?: string; // e.g., "name:asc"
};

export const addClassService = async (data: any) => {
  // validate classTeacher exists
  if (!mongoose.Types.ObjectId.isValid(data.classTeacher)) {
    throw new Error("Invalid classTeacher ID");
  }
  const teacherExists = await Teacher.findById(data.classTeacher);
  if (!teacherExists) throw new Error("Teacher not found");

  return await Class.create(data);
};

export const getClassesService = async (query: Query) => {
  const page = Math.max(1, parseInt(query.page || "1"));
  const limit = Math.max(1, Math.min(100, parseInt(query.limit || "10")));
  const skip = (page - 1) * limit;

  const filters: any = {};
  if (query.search) filters.name = { $regex: query.search, $options: "i" };
  if (query.teacher && mongoose.Types.ObjectId.isValid(query.teacher)) {
    filters.classTeacher = query.teacher;
  }

  // Sorting
  const [field, order] = (query.sort || "createdAt:desc").split(":");
  const sort: any = { createdAt: -1 };
  const allowedFields = new Set(["name", "section", "createdAt"]);
  if (allowedFields.has(field)) {
    sort[field] = order === "asc" ? 1 : -1;
  }

  const [classes, total] = await Promise.all([
    Class.find(filters)
      .populate("classTeacher", "name email subject")
      .populate("students", "name rollNo class")
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .lean(),
    Class.countDocuments(filters),
  ]);

  return {
    classes,
    total,
    page,
    pages: Math.ceil(total / limit),
    limit,
    filtersUsed: filters,
    sort,
  };
};

export const getClassByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Class ID");

  const classData = await Class.findById(id)
    .populate("classTeacher", "name email subject")
    .populate("students", "name rollNo class")
    .lean();

  return classData;
};

export const updateClassService = async (id: string, data: any) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Class ID");
  if (data.classTeacher && !mongoose.Types.ObjectId.isValid(data.classTeacher)) {
    throw new Error("Invalid classTeacher ID");
  }

  const updated = await Class.findByIdAndUpdate(id, data, { new: true })
    .populate("classTeacher", "name email subject")
    .populate("students", "name rollNo class")
    .lean();

  return updated;
};

export const deleteClassService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Class ID");
  return await Class.findByIdAndDelete(id);
};
    