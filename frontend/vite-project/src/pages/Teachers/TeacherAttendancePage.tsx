import React, { useEffect, useState } from "react";
import { getAttendanceSummary } from "../../api/attendanceApi";
import dayjs from "dayjs";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from "react-icons/fa";

type TeacherMin = { _id: string; name: string; email?: string };
type ClassroomMin = { _id?: string; name?: string; code?: string };

type SummaryResponse = {
  date?: string;
  // each entry: { id: string, teacher: TeacherMin | null }
  present?: Array<{ id: string; teacher?: TeacherMin }>;
  absent?: Array<{ id: string; teacher?: TeacherMin }>;
  late?: Array<{ id: string; teacher?: TeacherMin }>;
  missingCheckout?: Array<{ id: string; teacher?: TeacherMin }>;
  completed?: Array<{ id: string; teacher?: TeacherMin }>;
  attendances?: any[]; // raw attendance docs (optional)
};

export default function TeacherAttendancePage() {
  const [date, setDate] = useState<string>(() => dayjs().format("YYYY-MM-DD"));
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setRows([]);
    try {
      const res = await getAttendanceSummary(date);
      // IMPORTANT: backend returns { success: true, data: { ... } }
      const summary: SummaryResponse = res.data?.data ?? res.data ?? {};
     
      // Debug - uncomment if you need to inspect response
      console.log("Attendance raw response:", res.data);
      //console.log("Parsed summary:", summary);

      // Ensure arrays are defined
      const present = summary.present ?? [];
      const late = summary.late ?? [];
      const absent = summary.absent ?? [];
      const missingCheckout = summary.missingCheckout ?? [];
      const completed = summary.completed ?? [];

      // Normalize into display rows (one row per teacher id)
      // Use a map to avoid duplicates when a teacher appears in multiple lists
      const map = new Map<string, any>();

      const pushList = (list: Array<{ id: string; teacher?: TeacherMin }>, status: string) => {
        for (const item of list) {
          const id = String(item.id);
          const teacher = item.teacher ?? { _id: id, name: "Unknown", email: "-" };
          const existing = map.get(id) ?? {
            teacherId: teacher,
            classroom: "-", // can fill from attendances if needed
            status: status,
            checkInTime: "-",
            checkOutTime: "-",
          };
          // prefer more severe status: LATE > PRESENT > ABSENT
          if (existing.status === "ABSENT" && status === "PRESENT") existing.status = "PRESENT";
          if (existing.status !== "LATE" && status === "LATE") existing.status = "LATE";
          map.set(id, { ...existing, teacherId: teacher });
        }
      };

      pushList(absent, "ABSENT");
      pushList(present, "PRESENT");
      pushList(late, "LATE");
      pushList(missingCheckout, "MISSING_CHECKOUT");
      pushList(completed, "COMPLETED");

      // If backend provided raw attendances with times, merge them
      if (Array.isArray(summary.attendances)) {
        for (const a of summary.attendances) {
          const tid = String(a.teacherId?._id ?? a.teacherId ?? a.teacher);
          if (!tid) continue;
          const rec = map.get(tid) ?? {
            teacherId: a.teacherId ?? { _id: tid, name: "Unknown", email: "-" },
            classroom: a.classroomId ?? "-",
            status: a.status ?? "PRESENT",
            checkInTime: "-",
            checkOutTime: "-",
          };
          // populate times if available
          rec.checkInTime = a.checkInTime ? dayjs(a.checkInTime).format("hh:mm A") : "-";
          rec.checkOutTime = a.checkOutTime ? dayjs(a.checkOutTime).format("hh:mm A") : "-";
          rec.classroom = (a.classroomId && (a.classroomId.name || a.classroomId.code)) ? `${a.classroomId.name ?? ""} ${a.classroomId.code ?? ""}`.trim() : rec.classroom;
          // if attendance status exists use it
          if (a.status) rec.status = a.status;
          map.set(tid, rec);
        }
      }

      // Convert map to array for rendering
      const finalRows = Array.from(map.values());
      setRows(finalRows);
    } catch (err: any) {
      console.error("Failed to load attendance:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Teacher Attendance — {date}</h2>
        <div className="flex gap-2">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border px-2 py-1" />
          <button onClick={fetchData} className="bg-blue-600 text-white px-3 py-1 rounded">Refresh</button>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Teacher</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Classroom</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Check-in</th>
                <th className="border p-2">Check-out</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center">No records for this date</td></tr>
              ) : (
                rows.map((r, idx) => (
                  <tr key={r.teacherId._id ?? idx} className="hover:bg-gray-50">
                    <td className="border p-2">{r.teacherId.name}</td>
                    <td className="border p-2 text-center">{r.teacherId.email ?? "-"}</td>
                    <td className="border p-2 text-center">{r.classroom ?? "-"}</td>
                    <td className="border p-2 text-center font-semibold">
                      {r.status === "LATE" ? <><FaExclamationCircle className="inline text-yellow-500 mr-1"/>LATE</> :
                        r.status === "ABSENT" ? <><FaTimesCircle className="inline text-red-500 mr-1"/>ABSENT</> :
                        r.status === "MISSING_CHECKOUT" ? <><FaExclamationCircle className="inline text-orange-500 mr-1"/>MISSING CHECKOUT</> :
                        <><FaCheckCircle className="inline text-green-500 mr-1"/>PRESENT</>
                      }
                    </td>
                    <td className="border p-2 text-center">{r.checkInTime ?? "-"}</td>
                    <td className="border p-2 text-center">{r.checkOutTime ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
