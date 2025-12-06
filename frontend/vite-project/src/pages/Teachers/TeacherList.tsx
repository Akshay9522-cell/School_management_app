import { useEffect, useState } from "react";
import { getTeachers, updateTeacherClass, updateTeacherSubject } from "../../api/teacherApi";
import { getClasses } from "../../api/classApi";
import { useNavigate } from "react-router-dom";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  subject: string;
  phone?: string;
  isActive: boolean;
  classIds: {
    _id: string;
    name: string;
    section: string;
  }[];
}

interface ClassItem {
  _id: string;
  name: string;
  section: string;
}

const TeacherList = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<Record<string, string>>({});

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [classFilter, setClassFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadClasses();
    loadTeachers();
  }, [page, search, subjectFilter, classFilter]);

  const loadClasses = async () => {
    try {
      const res = await getClasses({});
      setClasses(res.data?.classes || []);
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  };

  const loadTeachers = async () => {
    try {
      const res = await getTeachers({
        page,
        limit,
        search,
        subject: subjectFilter,
        classIds: classFilter.length ? classFilter : undefined,
      });
      setTeachers(res.data?.data || []);
      setTotalPages(res.data?.pagination?.pages);
    } catch (err) {
      console.error("Failed to load teachers", err);
      setTeachers([]);
      setTotalPages(1);
    }
  };

  const handleClassAssign = async (teacherId: string) => {
    const selectedClassId = selectedClass[teacherId];
    if (!selectedClassId) {
      alert("Please select a class first");
      return;
    }

    const teacher = teachers.find((t) => t._id === teacherId);
    if (!teacher) return;

    const updatedClassIds = Array.from(
      new Set([...teacher.classIds.map((c) => c._id), selectedClassId])
    );

    try {
      await updateTeacherClass(teacherId, updatedClassIds);
      setSelectedClass((prev) => ({ ...prev, [teacherId]: "" }));
      loadTeachers();
    } catch (err) {
      console.error(err);
      alert("Failed to assign class");
    }
  };

  const inputGlass =
    "rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-slate-500 shadow-sm shadow-slate-900/50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500";

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-slate-200 via-slate-550 to-slate-600">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-black tracking-tight">
            Teachers
          </h2>
          <p className="text-sm text-slate-400">
            Manage teachers, classes, and subject assignments.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/teachers/add")}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/40 hover:from-indigo-400 hover:to-purple-400 transition-all duration-150"
        >
          <span className="text-lg leading-none">＋</span>
          <span>Add Teacher</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 ">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search teacher name, email..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className={inputGlass}
          />
        </div>

        {/* Subject filter */}
        <select
          value={subjectFilter}
          onChange={(e) => {
            setPage(1);
            setSubjectFilter(e.target.value);
          }}
          className={`${inputGlass} pr-8`}
        >
          <option value="">All Subjects</option>
          <option value="Math">Math</option>
          <option value="Science">Science</option>
          <option value="English">English</option>
          <option value="Computer">Computer</option>
          <option value="History">History</option>
          <option value="Biology">Biology</option>
          <option value="Geography">Geography</option>
          <option value="Social Science">Social Science</option>
        </select>

        {/* Class filter */}
        <select
          value={classFilter[0] || ""}
          onChange={(e) => {
            setPage(1);
            setClassFilter(e.target.value ? [e.target.value] : []);
          }}
          className={`${inputGlass} pr-8`}
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} {c.section}
            </option>
          ))}
        </select>
      </div>

      {/* Glass table card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-slate-900/40">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-4 md:p-6">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
            <span>Total Teachers: {teachers.length}</span>
            <span className="hidden sm:inline">
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
            <table className="min-w-full table-auto text-sm text-slate-200">
              <thead>
                <tr className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Subject</th>
                  <th className="px-4 py-3 text-left">Classes</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-slate-700"
                    >
                      No teachers found. Try adjusting your filters.
                    </td>
                  </tr>
                ) : (
                  teachers.map((t, idx) => (
                    <tr
                      key={t._id}
                      className={`border-t border-white/5 ${
                        idx % 2 === 0
                          ? "bg-slate-900/40"
                          : "bg-slate-900/25"
                      } hover:bg-slate-800/40 transition-colors`}
                    >
                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-50">
                            {t.name}
                          </span>
                          {t.phone && (
                            <span className="text-[11px] text-slate-400">
                              {t.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <span className="text-xs text-slate-300">
                          {t.email}
                        </span>
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-300 border border-indigo-500/30"
                        >
                          {t.subject || "Not Assigned"}
                        </span>
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap gap-1">
                            {t.classIds.length === 0 ? (
                              <span className="text-xs text-slate-500">
                                No classes
                              </span>
                            ) : (
                              t.classIds.map((c) => (
                                <span
                                  key={c._id}
                                  className="px-2 py-0.5 rounded-full bg-sky-500/10 text-xs text-sky-200 border border-sky-500/30"
                                >
                                  {c.name} {c.section}
                                </span>
                              ))
                            )}
                          </div>

                          {/* Assign new class */}
                          <div className="flex items-center gap-2 mt-1">
                            <select
                              value={selectedClass[t._id] || ""}
                              onChange={(e) =>
                                setSelectedClass((prev) => ({
                                  ...prev,
                                  [t._id]: e.target.value,
                                }))
                              }
                              className="h-8 w-28 rounded-lg border border-white/20 bg-slate-900/60 px-2 text-xs text-white focus:border-indigo-400"
                            >
                              <option value="">Add class</option>
                              {classes.map((c) => (
                                <option key={c._id} value={c._id}>
                                  {c.name} {c.section}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleClassAssign(t._id)}
                              className="h-8 px-2.5 rounded-lg border border-emerald-500/60 bg-emerald-500/10 text-xs font-medium text-emerald-200 hover:bg-emerald-500/25 transition-colors"
                              disabled={!selectedClass[t._id]}
                            >
                              Assign
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center align-middle">
                        <div
                          className={`inline-flex w-3 h-3 rounded-full shadow-sm ${
                            t.isActive
                              ? "bg-emerald-400 shadow-emerald-500/50 animate-pulse"
                              : "bg-rose-400 shadow-rose-500/50"
                          }`}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-center gap-3 text-sm">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-full border border-white/20 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200 disabled:opacity-40 hover:bg-slate-800/80 transition-colors"
            >
              Prev
            </button>

            <div className="flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-200 border border-white/10">
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-indigo-200 font-semibold">
                {page}
              </span>
              <span className="text-slate-400">/ {totalPages}</span>
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-full border border-white/20 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200 disabled:opacity-40 hover:bg-slate-800/80 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherList;
