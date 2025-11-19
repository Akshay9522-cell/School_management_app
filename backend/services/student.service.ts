// services/student.service.ts
import Student from "../models/Student";
import Class from "../models/Class";

type Query = {
  page?: any;
  limit?: any;
  search?: string;
  class?: string; // class name or id filter
  section?: string;
  sort?: string;
  admissionNo?: string;
  minRoll?: any;
  maxRoll?: any;
};

// Create student and link to class (auto-roll number)
export const addStudentService = async (data: any) => {
  if (!data.classId) {
    throw new Error("classId is required to assign a roll number");
  }

  // Validate class exists
  const classExists = await Class.findById(data.classId);
  if (!classExists) throw new Error("Invalid classId provided");

  // Find the highest roll number in this class
  const lastStudent = await Student.find({ classId: data.classId })
    .sort({ rollNo: -1 })
    .limit(1)
    .lean();

  const nextRollNo = lastStudent.length > 0 ? Number(lastStudent[0].rollNo) + 1 : 1;

  // Assign the generated roll no (NUMBER)
  data.rollNo = nextRollNo;

  const student = await Student.create(data);

  // Add student reference to class (idempotent)
  await Class.findByIdAndUpdate(data.classId, {
    $addToSet: { students: student._id },
  });

  return student;
};

// Get students with filters (className or classId, section, search, roll range)
export const getStudentsService = async (query: Query) => {
  const page = Math.max(1, parseInt(String(query.page || "1"), 10));
  const limit = Math.max(1, Math.min(200, parseInt(String(query.limit || "10"), 10)));
  const skip = (page - 1) * limit;

  // Prepare filters
  const filters: any = {};

  // ---------- SEARCH ----------
  if (query.search) {
    const s = String(query.search).trim();
    const isNumber = !isNaN(Number(s));

    // If numeric search and no min/max specified, treat as exact rollNo search
    const hasRange = (query.minRoll !== undefined) || (query.maxRoll !== undefined);

    if (isNumber && !hasRange) {
      filters.rollNo = Number(s);
    } else {
      filters.$or = [
        { name: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
        { admissionNo: { $regex: s, $options: "i" } },
      ];
    }
  }

  // ---------- CLASS & SECTION FILTER ----------
  // We'll build a classIds array from class name/id and/or section and then apply $in
  let classIds: any[] = [];

  if (query.class) {
    const c = String(query.class).trim();
    if (/^[0-9a-fA-F]{24}$/.test(c)) {
      classIds.push(c);
    } else {
      const classesByName = await Class.find({ name: { $regex: c, $options: "i" } }, "_id").lean();
      classIds = classIds.concat(classesByName.map((x: any) => x._id));
    }
  }

  if (query.section) {
    const section = String(query.section).trim();
    const classesBySection = await Class.find({ section }, "_id").lean();
    const sectionIds = classesBySection.map((x: any) => x._id);

    // If we already have classIds (from name or id), intersect them with sectionIds
    if (classIds.length > 0) {
      classIds = classIds.filter((id) => sectionIds.some((sid) => String(sid) === String(id)));
    } else {
      classIds = sectionIds;
    }
  }

  if (classIds.length > 0) {
    filters.classId = { $in: classIds };
  }

  // ---------- ROLL RANGE ----------
  const minRoll = query.minRoll !== undefined ? Number(query.minRoll) : undefined;
  const maxRoll = query.maxRoll !== undefined ? Number(query.maxRoll) : undefined;

  if (minRoll !== undefined || maxRoll !== undefined) {
    // If filters.rollNo already set to a number (from numeric search), we replace it with range,
    // because range request is more explicit.
    const rollFilter: any = {};
    if (minRoll !== undefined && !Number.isNaN(minRoll)) rollFilter.$gte = minRoll;
    if (maxRoll !== undefined && !Number.isNaN(maxRoll)) rollFilter.$lte = maxRoll;
    filters.rollNo = rollFilter;
  }

  // ---------- SORT ----------
  const ALLOWED_SORT_FIELDS = new Set(["name", "rollNo", "admissionNo", "createdAt"]);
  let sort: any = { createdAt: -1 };
  if (query.sort) {
    try {
      const [field, order] = String(query.sort).split(":");
      if (ALLOWED_SORT_FIELDS.has(field)) {
        sort = { [field]: order === "asc" ? 1 : -1 };
      }
    } catch {
      sort = { createdAt: -1 };
    }
  }

  // ---------- QUERY + COUNT ----------
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

export const getStudentByIdService = async (id: string) => {
  return await Student.findById(id).populate("classId", "name section").lean();
};

export const updateStudentService = async (id: string, data: any) => {
  // Fetch previous student to compare classId
  const prev = await Student.findById(id).lean();

  const updatedStudent = await Student.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();

  // If classId changed, update Class documents
  if (prev && data.classId && String(prev.classId) !== String(data.classId)) {
    // remove from any class that still contains this student id (safe cleanup)
    await Class.updateMany({ students: id }, { $pull: { students: id } });
    // add to new class
    await Class.findByIdAndUpdate(data.classId, { $addToSet: { students: id } });
  }

  return updatedStudent;
};

export const deleteStudentService = async (id: string) => {
  const student = await Student.findByIdAndDelete(id).lean();
  if (student?.classId) {
    await Class.findByIdAndUpdate(student.classId, { $pull: { students: id } });
  }
  return student;
};
