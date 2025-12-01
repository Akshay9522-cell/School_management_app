import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getAttendanceSummary } from "../../api/studentDailyAttendanceApi";
import { getClasses } from "../../api/classApi";

interface AttendanceRecord {
  date: string;
  studentName: string;
  status: "present" | "absent" | "leave" | "late";
  note?: string;
}

interface AttendanceStats {
  total: number;
  present: number;
  percentage: number;
}

export default function AttendanceSummaryPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [summary, setSummary] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({ total: 0, present: 0, percentage: 0 });
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
      const res = await getAttendanceSummary({ classId, startDate: date, endDate: date });
      setSummary(res.data.summary || []);
      setStats(res.data.stats || { total: 0, present: 0, percentage: 0 });
    } catch (err) {
      console.error("Summary Fetch Error:", err);
      alert("Failed to fetch summary. Check console.");
    }
    setLoading(false);
  };

  const downloadCSV = () => {
    if (!summary.length) return alert("No data to download");

    const header = "Student Name,Status,Note,Date\n";
    const rows = summary
      .map((r) => `${r.studentName},${r.status},${r.note || "-"},${dayjs(r.date).format("DD MMM YYYY")}`)
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Attendance_${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  console.log("Selected classId:", classId);
console.log("Date:", date);


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Attendance Summary</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <select className="border p-2 rounded" value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        <input type="date" className="border p-2 rounded" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <button onClick={fetchSummary} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? "Fetching..." : "Get Summary"}
      </button>

      {summary.length > 0 && (
        <button onClick={downloadCSV} className="bg-green-600 text-white px-3 py-2 ml-3 rounded">
          Download CSV
        </button>
      )}

      <div className="mt-6 bg-gray-100 p-4 rounded shadow">
        <p><b>Total Students:</b> {stats.total}</p>
        <p><b>Present:</b> {stats.present}</p>
        <p><b>Percentage:</b> {stats.percentage}%</p>
      </div>

      <table className="w-full border mt-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Student</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Note</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((s, i) => (
            <tr key={i}>
              <td className="border p-2">{s.studentName}</td>
              <td className={`border p-2 font-bold ${s.status === "present" ? "text-green-600" : "text-red-600"}`}>
                {s.status.toUpperCase()}
              </td>
              <td className="border p-2">{s.note || "-"}</td>
            </tr>
          ))}
          {!loading && summary.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center p-3">No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
