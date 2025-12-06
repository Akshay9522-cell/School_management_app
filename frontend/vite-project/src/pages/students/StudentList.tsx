import { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "../../api/studentApi";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import Loader from "../../components/Loader";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  rollNo: number;
  admissionNo: string;
  gender: string;
  status: string;
  classId?: {
    name: string;
    section: string;
  };
}

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const query = `?page=${page}&search=${search}`;
      const res = await getStudents(query);
      setStudents(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching students", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (error) {
      console.error("Failed to delete student", error);
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-black tracking-tight">
            Students
          </h1>
          <p className="text-sm text-slate-400">
            Browse, search and manage all enrolled students.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/students/add")}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/40 hover:from-emerald-400 hover:to-sky-400 transition-all duration-150"
        >
          <span className="text-lg leading-none">＋</span>
          <span>Add Student</span>
        </button>
      </div>

      {/* Search + filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-md">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-100" />
          <input
            type="text"
            value={search}
            placeholder="Search by name, email, roll no..."
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full rounded-full border border-white/15 bg-slate-900/70 px-10 py-2.5 text-sm text-white placeholder:text-slate-300 shadow-sm shadow-slate-900/60 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <button
          onClick={handleSearch}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-sky-500 border border-sky-500/40 hover:bg-sky-500/20 hover:text-sky-500 transition-all"
        >
          Search
        </button>
      </div>

      {/* Glass card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-slate-900/40">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                <span>Total Students: {students.length}</span>
                <span className="hidden sm:inline">
                  Page {page} of {totalPages}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
                <table className="min-w-full table-auto text-sm text-slate-200">
                  <thead>
                    <tr className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-4 py-3 text-left">Roll No</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Class</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-6 text-center text-slate-500"
                        >
                          No students found. Try adjusting your search.
                        </td>
                      </tr>
                    ) : (
                      students.map((stu, idx) => (
                        <tr
                          key={stu._id}
                          className={`border-t border-white/5 ${
                            idx % 2 === 0
                              ? "bg-slate-900/40"
                              : "bg-slate-900/25"
                          } hover:bg-slate-800/40 transition-colors`}
                        >
                          <td className="px-4 py-3 align-middle">
                            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-100">
                              {stu.rollNo}
                            </span>
                          </td>

                          <td className="px-4 py-3 align-middle">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-50">
                                {stu.name}
                              </span>
                              <span className="text-[11px] text-slate-300">
                                {stu.admissionNo}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3 align-middle">
                            <span className="text-xs text-slate-300">
                              {stu.classId
                                ? `${stu.classId.name} - ${stu.classId.section}`
                                : "N/A"}
                            </span>
                          </td>

                          <td className="px-4 py-3 align-middle">
                            <span className="text-xs text-slate-300">
                              {stu.email}
                            </span>
                          </td>

                          <td className="px-4 py-3 align-middle">
                            <span className="text-xs text-slate-300">
                              {stu.phone}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-center align-middle">
                            <span
                              className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                                stu.status === "Active"
                                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                                  : "bg-rose-500/15 text-rose-300 border border-rose-500/40"
                              }`}
                            >
                              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
                              {stu.status}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right align-middle">
                            <div className="flex justify-end gap-2">
                              <button
                                className="rounded-lg border border-amber-400/60 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200 hover:bg-amber-500/25 transition-colors"
                                onClick={() =>
                                  navigate(`/students/edit/${stu._id}`)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="rounded-lg border border-rose-500/70 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-200 hover:bg-rose-500/25 transition-colors"
                                onClick={() => handleDelete(stu._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full border border-white/20 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200 disabled:opacity-40 hover:bg-slate-800/80 transition-colors"
          >
            Prev
          </button>

          <div className="flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-200 border border-white/10">
            <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-sky-200 font-semibold">
              {page}
            </span>
            <span className="text-slate-400">/ {totalPages}</span>
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-white/20 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200 disabled:opacity-40 hover:bg-slate-800/80 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentList;
