import React, { useEffect, useState } from "react";
import { getAttendanceSummary } from "../../api/attendanceApi";
import dayjs from "dayjs";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from "react-icons/fa";

type TeacherMin = { _id: string; name: string; email?: string };
type ClassroomMin = { _id?: string; name?: string; code?: string };

type SummaryResponse = {
  date?: string;
  present?: Array<{ id: string; teacher?: TeacherMin }>;
  absent?: Array<{ id: string; teacher?: TeacherMin }>;
  late?: Array<{ id: string; teacher?: TeacherMin }>;
  missingCheckout?: Array<{ id: string; teacher?: TeacherMin }>;
  completed?: Array<{ id: string; teacher?: TeacherMin }>;
  attendances?: any[];
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
      const summary: SummaryResponse = res.data?.data ?? res.data ?? {};

      const present = summary.present ?? [];
      const late = summary.late ?? [];
      const absent = summary.absent ?? [];
      const missingCheckout = summary.missingCheckout ?? [];
      const completed = summary.completed ?? [];

      const map = new Map<string, any>();

      const pushList = (list: Array<{ id: string; teacher?: TeacherMin }>, status: string) => {
        for (const item of list) {
          const id = String(item.id);
          const teacher = item.teacher ?? { _id: id, name: "Unknown", email: "-" };
          const existing = map.get(id) ?? {
            teacherId: teacher,
            classroom: "-",
            status: status,
            checkInTime: "-",
            checkOutTime: "-",
          };
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
          rec.checkInTime = a.checkInTime ? dayjs(a.checkInTime).format("hh:mm A") : "-";
          rec.checkOutTime = a.checkOutTime ? dayjs(a.checkOutTime).format("hh:mm A") : "-";
          rec.classroom = (a.classroomId && (a.classroomId.name || a.classroomId.code)) 
            ? `${a.classroomId.name ?? ""} ${a.classroomId.code ?? ""}`.trim() 
            : rec.classroom;
          if (a.status) rec.status = a.status;
          map.set(tid, rec);
        }
      }

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
  }, [date]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "LATE":
        return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/40";
      case "ABSENT":
        return "bg-rose-500/15 text-rose-300 border border-rose-500/40";
      case "MISSING_CHECKOUT":
        return "bg-orange-500/15 text-orange-300 border border-orange-500/40";
      case "PRESENT":
      case "COMPLETED":
        return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40";
      default:
        return "bg-slate-500/15 text-slate-300 border border-slate-500/40";
    }
  };

  const inputGlass =
    "rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-slate-500 shadow-sm shadow-slate-900/50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500";

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-slate-200 via-slate-550 to-slate-600">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">
              Teacher Attendance
            </h2>
            <p className="text-sm text-slate-400">
              {dayjs(date).format("MMMM DD, YYYY")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputGlass}
              />
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-sky-500/40 hover:from-sky-400 hover:to-indigo-400 transition-all disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl p-4 bg-rose-500/90 text-white border border-rose-500/50 shadow-lg shadow-rose-500/40 text-sm">
            {error}
          </div>
        )}

        {/* Glass table card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-slate-900/40">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />

          <div className="p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
              <span>Total Records: {rows.length}</span>
              {loading && <span className="animate-pulse">Refreshing...</span>}
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
              <table className="min-w-full table-auto text-sm text-slate-200">
                <thead>
                  <tr className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-3 text-left">Teacher</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Classroom</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Check-in</th>
                    <th className="px-4 py-3 text-center">Check-out</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        Loading attendance data...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        No attendance records for {dayjs(date).format("MMMM DD, YYYY")}.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, idx) => (
                      <tr
                        key={r.teacherId._id ?? idx}
                        className={`border-t border-white/5 ${
                          idx % 2 === 0 ? "bg-slate-900/40" : "bg-slate-900/25"
                        } hover:bg-slate-800/40 transition-colors`}
                      >
                        <td className="px-4 py-3 align-middle">
                          <span className="font-medium text-slate-50">
                            {r.teacherId.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <span className="text-xs text-slate-400">
                            {r.teacherId.email ?? "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center align-middle">
                          <span className="text-xs text-slate-300">
                            {r.classroom ?? "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center align-middle">
                          <span
                            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              r.status
                            )}`}
                          >
                            {r.status === "LATE" ? (
                              <FaExclamationCircle className="mr-1 h-3 w-3" />
                            ) : r.status === "ABSENT" ? (
                              <FaTimesCircle className="mr-1 h-3 w-3" />
                            ) : r.status === "MISSING_CHECKOUT" ? (
                              <FaExclamationCircle className="mr-1 h-3 w-3" />
                            ) : (
                              <FaCheckCircle className="mr-1 h-3 w-3" />
                            )}
                            {r.status || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center align-middle">
                          <span className="text-xs text-slate-300">
                            {r.checkInTime ?? "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center align-middle">
                          <span className="text-xs text-slate-300">
                            {r.checkOutTime ?? "-"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
