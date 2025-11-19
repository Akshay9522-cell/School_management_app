import React, { useEffect, useState } from "react";
import { getAttendances } from "../../api/attandanceApi";
import { getClasses } from "../../api/classApi";
import { getStudents } from "../../api/studentApi";
import { useNavigate } from "react-router-dom";

const AttendanceList: React.FC = () => {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // Filters
  const [filters, setFilters] = useState({
    classId: "",
    studentId: "",
    date: "",
    status: "",
    page: 1,
  });

  const [totalPages, setTotalPages] = useState(1);

  // Load Classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClasses();
        setClasses(res.data.classes || []);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    };

    fetchClasses();
  }, []);

  // Load students for class
  useEffect(() => {
    if (!filters.classId) {
      setStudents([]);
      setFilters((prev) => ({ ...prev, studentId: "" }));
      return;
    }

    const fetchStudents = async () => {
      try {
        const res = await getStudents({ classId: filters.classId });

        setStudents(res.data.data || res.data || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, [filters.classId]);

  // Load Attendance
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await getAttendances(filters);

        setAttendance(res.data.data || []); // safe array fallback
        console.log(attendance)
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
      }
    };

    fetchAttendance();
  }, [filters]);

  const handleFilterChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters({ ...filters, page: newPage });
  };

  const getStatusColor = (s: string) => {
    if (s === "present") return "text-green-600";
    if (s === "absent") return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Attendance List</h1>

        <button
          onClick={() => navigate("/dashboard/attendance/add")}
          className="bg-blue-500 px-4 py-2 text-white rounded"
        >
          Add Attendance
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {/* Class Filter */}
        <select
          name="classId"
          value={filters.classId}
          onChange={handleFilterChange}
          className="border px-2 py-2 rounded"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} - {c.section}
            </option>
          ))}
        </select>

        {/* Student Filter */}
        <select
          name="studentId"
          value={filters.studentId}
          onChange={handleFilterChange}
          className="border px-2 py-2 rounded"
        >
          <option value="">All Students</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.rollNo})
            </option>
          ))}
        </select>

        {/* Date Filter */}
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="border px-2 py-2 rounded"
        />

        {/* Status Filter */}
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border px-2 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
        </select>

        {/* Reset Filter */}
        <button
          onClick={() =>
            setFilters({
              classId: "",
              studentId: "",
              date: "",
              status: "",
              page: 1,
            })
          }
          className="bg-gray-300 px-3 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* Attendance Table */}
      <div className="border rounded overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance?.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-5">
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendance?.map((a) => (
                <tr key={a?._id}>
                  <td className="p-2 border">{a?.student?.name}</td>

                  <td className="p-2 border">
                    {a?.class?.name} - {a?.class?.section}
                  </td>

                  <td className="p-2 border">
                    {a?.date ? a.date.slice(0, 10) : ""}
                  </td>

                  <td
                    className={`p-2 border font-semibold ${getStatusColor(
                      a?.status
                    )}`}
                  >
                    {a?.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          onClick={() => handlePageChange(filters.page - 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Prev
        </button>

        <span>
          Page {filters.page} / {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(filters.page + 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AttendanceList;
