  // services/student.service.ts
  import Student from "../models/Student";
  import Class from "../models/Class";
  import ClassCounter from "../models/ClassCounter";
  import mongoose from "mongoose";

  type Query = {
    page?: any;
    limit?: any;
    search?: string;
    class?: string;
    classId?:string; // class name or id filter
    section?: string;
    sort?: string;
    admissionNo?: string;
    minRoll?: any;
    maxRoll?: any;
  };

  // Create student and link to class (auto-roll number)
// services/student.service.ts



export const addStudentService = async (data: any) => {
  if (!data.classId) throw new Error("classId is required to assign a roll number");

  // Validate class exists
  const classExists = await Class.findById(data.classId);
  if (!classExists) throw new Error("Invalid classId provided");

  // ---------- ATOMIC ROLL NO ----------
 // ---------- SAFE ATOMIC ROLL NO ----------
let assignedRoll = null;

for (let i = 0; i < 5; i++) {
  try {
    // Try to increment and lock a new roll number
    const counter = await ClassCounter.findOneAndUpdate(
      { classId: data.classId },
      { $inc: { lastRollNo: 1 } },
      { new: true, upsert: true }
    );

    assignedRoll = counter.lastRollNo;

    // Try to create student
    const student = await Student.create({
      ...data,
      rollNo: assignedRoll,
    });

    // Store roll & attach to class
    await Class.findByIdAndUpdate(data.classId, {
      $addToSet: { students: student._id },
    });

    return student; // SUCCESS 🎉
  } catch (err: any) {
    if (err.code === 11000) {
      console.log("Roll duplicate detected → retrying...");
      continue; // Try again
    }
    throw err;
  }
}

throw new Error("Roll number generation failed after multiple attempts");
}


  // Get students with filters (className or classId, section, search, roll range)
export const getStudentsService = async (query: Query) => {
  const page = Math.max(1, parseInt(String(query.page || "1"), 10));
  const limit = Math.max(1, Math.min(200, parseInt(String(query.limit || "10"), 10)));
  const skip = (page - 1) * limit;

  const filters: any = {};

  // -----------------------------
  // DIRECT classId (highest priority)
  // -----------------------------
  if (query.classId) {
    const id = String(query.classId).trim();
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      filters.classId = new mongoose.Types.ObjectId(id);
    }
  }

  // -----------------------------
  // SEARCH
  // -----------------------------
  if (query.search) {
    const s = String(query.search).trim();
    const isNumber = !isNaN(Number(s));
    const hasRange = query.minRoll !== undefined || query.maxRoll !== undefined;

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

  // -----------------------------
  // CLASS (name/id) and SECTION (only if classId not provided)
  // -----------------------------
  // If classId already applied we skip the heavy Class lookups
  if (!filters.classId) {
    let classIds: mongoose.Types.ObjectId[] = [];

    if (query.class) {
      const classQuery = String(query.class).trim();
      if (/^[0-9a-fA-F]{24}$/.test(classQuery)) {
        classIds.push(new mongoose.Types.ObjectId(classQuery));
      } else {
        const classesByName = await Class.find(
          { name: { $regex: classQuery, $options: "i" } },
          "_id"
        )
          .lean()
          .exec();
        classIds = classIds.concat(classesByName.map((c: any) => new mongoose.Types.ObjectId(c._id)));
      }
    }

    if (query.section) {
      const sectionQuery = String(query.section).trim();
      const classesBySection = await Class.find({ section: sectionQuery }, "_id").lean().exec();
      const sectionIds = classesBySection.map((c: any) => new mongoose.Types.ObjectId(c._id));

      if (classIds.length > 0) {
        // intersection
        classIds = classIds.filter((id) => sectionIds.some((sid) => String(sid) === String(id)));
      } else {
        classIds = sectionIds;
      }
    }

    if (classIds.length > 0) {
      filters.classId = { $in: classIds };
    }
  }

  // -----------------------------
  // admissionNo exact filter (if provided)
  // -----------------------------
  if (query.admissionNo) {
    filters.admissionNo = String(query.admissionNo).trim();
  }

  // -----------------------------
  // ROLL RANGE (overrides numeric search)
  // -----------------------------
  const minRoll = query.minRoll !== undefined ? Number(query.minRoll) : undefined;
  const maxRoll = query.maxRoll !== undefined ? Number(query.maxRoll) : undefined;

  if ((minRoll !== undefined && !Number.isNaN(minRoll)) || (maxRoll !== undefined && !Number.isNaN(maxRoll))) {
    const rollFilter: any = {};
    if (minRoll !== undefined && !Number.isNaN(minRoll)) rollFilter.$gte = minRoll;
    if (maxRoll !== undefined && !Number.isNaN(maxRoll)) rollFilter.$lte = maxRoll;
    filters.rollNo = rollFilter;
  }

  // -----------------------------
  // SORT
  // -----------------------------
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

  // -----------------------------
  // FETCH + COUNT (parallel)
  // -----------------------------
  const projection = { __v: 0 }; // avoid sending __v

  const studentsPromise = Student.find(filters, projection)
    .populate("classId", "name section")
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .lean()
    .exec();

  const countPromise = Student.countDocuments(filters).exec();

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
