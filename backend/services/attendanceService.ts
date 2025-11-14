import Attendance from "../models/Attendance";
import Student from "../models/Student";
import mongoose from "mongoose";

type Query = {
  page?: any;
  limit?: any;
  student?: string;   // student id filter
  class?: string;     // class id filter
  date?: string;      // specific date filter
  sort?: string;      // e.g. "date:desc"
};



// ✅ Add Attendance
export const addAttendanceService = async (data: any) => {
  // Optional: validate student ID
  if (!mongoose.Types.ObjectId.isValid(data.student)) {
    throw new Error("Invalid Student ID");
  }

  const studentExists = await Student.findById(data.student);
  if (!studentExists) throw new Error("Student not found");

  const attendance = await Attendance.create(data);
  return attendance;
};

// ✅ Get Attendance Records
export const getAttendanceService = async (query: Query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  const filters: any = {};

  if (query.student) filters.student = query.student;
  if (query.class) filters.class = query.class;
  if (query.date) filters.date = new Date(query.date);

  const sortQuery = query.sort || "date:desc";
  let sort: any = { date: -1 };
  try {
    const [field, order] = sortQuery.split(":");
    sort = { [field]: order === "asc" ? 1 : -1 };
  } catch {
    sort = { date: -1 };
  }

  const attendancePromise = Attendance.find(filters)
    .populate("student", "name rollNo class")
    .populate("class", "name section")
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .lean();

  const countPromise = Attendance.countDocuments(filters);

  const [records, total] = await Promise.all([attendancePromise, countPromise]);

  return {
    records,
    total,
    page,
    pages: Math.ceil(total / limit),
    limit,
    filtersUsed: filters,
    sort,
  };
};

// ✅ Get Attendance By ID
export const getAttendanceByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Attendance ID");
  return Attendance.findById(id)
    .populate("student", "name rollNo class")
    .populate("class", "name section");
};

// ✅ Update Attendance
export const updateAttendanceService = async (id: string, data: any) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Attendance ID");
  return Attendance.findByIdAndUpdate(id, data, { new: true });
};

// ✅ Delete Attendance
export const deleteAttendanceService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Attendance ID");
  return Attendance.findByIdAndDelete(id);
};


// ✅ Bulk Add/Update Attendance
export const bulkAttendanceService = async (data: {
  classId: string;
  date: string;
  records: { studentId: string; status: "present" | "absent" | "late" }[];
}) => {
  const { classId, date, records } = data;

  // Validate classId
  if (!mongoose.Types.ObjectId.isValid(classId)) throw new Error("Invalid Class ID");

  const bulkOps = records.map((record) => ({
    updateOne: {
      filter: { student: record.studentId, class: classId, date },
      update: { $set: { status: record.status } },
      upsert: true, // create if not exists
    },
  }));

  const result = await Attendance.bulkWrite(bulkOps);
  return result;
};
