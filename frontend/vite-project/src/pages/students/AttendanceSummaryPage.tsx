import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getAttendanceSummary } from "../../api/studentDailyAttendanceApi";
import { getClasses } from "../../api/classApi";

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: "present" | "absent" | "leave" | "late";
  note?: string;
}

interface AttendanceStats {
  present: number;
  absent: number;
}

export default function AttendanceSummaryPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [summary, setSummary] = useState<AttendanceStats>({ present: 0, absent: 0 });
  const [result, setResult] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const res = await getClasses({ limit: 1000, page: 1 });
      setClasses(res.data.classes || []);
    } catch (err) {
      console.error("Class Fetch Error:", err);
    }
  };

  const fetchSummary = async () => {
    if (!classId) return alert("Please select a class");

    setLoading(true);
    try {
      const res = await getAttendanceSummary({ classId, date });

      setSummary(res.data.summary || { present: 0, absent: 0 });
      setResult(res.data.result || []);
    } catch (err) {
      console.error("Summary Fetch Error:", err);
      alert("Failed to fetch summary.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
        Attendance Summary
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Class Dropdown */}
        <select
          className="border p-3 rounded-xl shadow bg-white"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        {/* Date Field */}
        <input
          type="date"
          className="border p-3 rounded-xl shadow bg-white"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Fetch Button */}
      <button
        onClick={fetchSummary}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90"
      >
        {loading ? "Fetching..." : "Get Summary"}
      </button>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-5 rounded-xl shadow bg-gradient-to-r from-green-400 to-green-600 text-white">
          <h3 className="text-xl font-bold">Present</h3>
          <p className="text-3xl font-bold">{summary.present}</p>
        </div>

        <div className="p-5 rounded-xl shadow bg-gradient-to-r from-red-400 to-red-600 text-white">
          <h3 className="text-xl font-bold">Absent</h3>
          <p className="text-3xl font-bold">{summary.absent}</p>
        </div>
      </div>

      {/* Student Table */}
      <table className="w-full border mt-6 rounded-xl overflow-hidden shadow-lg">
        <thead className="bg-gradient-to-r from-gray-200 to-gray-300">
          <tr>
            <th className="border p-3">Student</th>
            <th className="border p-3">Status</th>
            <th className="border p-3">Note</th>
          </tr>
        </thead>

        <tbody>
          {result.map((s, i) => (
            <tr key={i} className="bg-white hover:bg-gray-100 transition">
              <td className="border p-3">{s.studentName}</td>
              <td
                className={`border p-3 font-bold ${
                  s.status === "present" ? "text-green-600" : "text-red-600"
                }`}
              >
                {s.status.toUpperCase()}
              </td>
              <td className="border p-3">{s.note || "-"}</td>
            </tr>
          ))}

          {!loading && result.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
