import Teacher from "../models/Teacher";

type Query = {
  page?: any;
  limit?: any;
  search?: string;
  subject?: string;
  sort?: string; // e.g. "name:asc" or "joiningDate:desc"
};

export const addTeacherService = async (data: any) => {
  return await Teacher.create(data);
};

export const getTeachersService = async (query: Query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  const search = query.search || "";
  const subject = query.subject || "";
  const sortQuery = query.sort || "createdAt:desc";

  // Filters
  const filters: any = {};
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (subject) {
    filters.subject = subject;
  }

  // Sorting
  const ALLOWED_SORT_FIELDS = new Set(["name", "email", "subject", "joiningDate", "createdAt"]);
  let sort: any = { createdAt: -1 };
  try {
    const [field, order] = sortQuery.split(":");
    if (ALLOWED_SORT_FIELDS.has(field)) {
      sort = { [field]: order === "asc" ? 1 : -1 };
    }
  } catch {
    sort = { createdAt: -1 };
  }

  const teachersPromise = Teacher.find(filters).skip(skip).limit(limit).sort(sort).lean();
  const countPromise = Teacher.countDocuments(filters);
  const [teachers, total] = await Promise.all([teachersPromise, countPromise]);

  return {
    teachers,
    total,
    page,
    pages: Math.ceil(total / limit),
    limit,
    filtersUsed: filters,
    sort,
  };
};

export const getTeacherByIdService = async (id: string) => {
  return await Teacher.findById(id);
};

export const updateTeacherService = async (id: string, data: any) => {
  return await Teacher.findByIdAndUpdate(id, data, { new: true });
};

export const deleteTeacherService = async (id: string) => {
  return await Teacher.findByIdAndDelete(id);
};
