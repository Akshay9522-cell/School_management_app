import Student from "../models/Student";
import Class from "../models/Class";

type Query = {
  page?: any;
  limit?: any;
  search?: string;
  class?: string; // class name or id filter
  sort?: string; // e.g. "name:asc" or "rollNo:desc"
  minRoll?: any;
  maxRoll?: any;
};

// ✅ Create a student and link to Class
export const addStudentService = async (data: any) => {
  // Optional: validate classId if provided
  if (data.classId) {
    const classExists = await Class.findById(data.classId);
    if (!classExists) throw new Error("Invalid classId provided");

    // Create student
    const student = await Student.create(data);

    // Add this student to the class' students array
    await Class.findByIdAndUpdate(data.classId, {
      $addToSet: { students: student._id },
    });

    return student;
  }

  // If no classId — still allow standalone creation
  return await Student.create(data);
};

// ✅ Get all students (with pagination, filters, sorting)
export const getStudentsService = async (query: Query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  const search = query.search || "";
  const classFilter = query.class || "";
  const sortQuery = query.sort || "createdAt:desc";
  const minRoll = query.minRoll !== undefined ? parseInt(query.minRoll) : undefined;
  const maxRoll = query.maxRoll !== undefined ? parseInt(query.maxRoll) : undefined;

  const filters: any = {};

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (classFilter) {
    filters.class = classFilter;
  }

  if (minRoll !== undefined || maxRoll !== undefined) {
    filters.rollNo = {};
    if (minRoll !== undefined) filters.rollNo.$gte = minRoll;
    if (maxRoll !== undefined) filters.rollNo.$lte = maxRoll;
  }

  const ALLOWED_SORT_FIELDS = new Set(["name", "rollNo", "class", "createdAt"]);
  let sort: any = { createdAt: -1 };
  try {
    const [field, order] = sortQuery.split(":");
    if (ALLOWED_SORT_FIELDS.has(field)) {
      sort = { [field]: order === "asc" ? 1 : -1 };
    }
  } catch {
    sort = { createdAt: -1 };
  }

  const studentsPromise = Student.find(filters)
    .populate("classId", "name section")
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .lean();

  const countPromise = Student.countDocuments(filters);
  const [students, total] = await Promise.all([studentsPromise, countPromise]);

  return {
    students,
    total,
    page,
    pages: Math.ceil(total / limit),
    limit,
    sort,
    filtersUsed: filters,
  };
};

// ✅ Get Student by ID
export const getStudentByIdService = async (id: string) => {
  return await Student.findById(id).populate("classId", "name section");
};

// ✅ Update Student
export const updateStudentService = async (id: string, data: any) => {
  const updatedStudent = await Student.findByIdAndUpdate(id, data, { new: true });

  // Update class references if classId changed
  if (data.classId && updatedStudent) {
    await Class.updateMany({ students: id }, { $pull: { students: id } });
    await Class.findByIdAndUpdate(data.classId, { $addToSet: { students: id } });
  }

  return updatedStudent;
};

// ✅ Delete Student
export const deleteStudentService = async (id: string) => {
  const student = await Student.findByIdAndDelete(id);
  if (student?.classId) {
    await Class.findByIdAndUpdate(student.classId, { $pull: { students: id } });
  }
  return student;
};
