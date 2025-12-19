import React, { useEffect, useState } from "react";
import { FaUsers, FaChalkboardTeacher, FaSchool } from "react-icons/fa";
import dayjs from "dayjs";
import {
  getStudentCount,
  getTeacherCount,
  getClassCount,
  getTodayTeacherAttendanceSummary,
} from "../api/dashboard";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
  });

  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
    late: 0,
    missingCheckout: 0,
  });

  const [rows, setRows] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [attLoading, setAttLoading] = useState(true);

  const today = dayjs().format("YYYY-MM-DD");

  // ---- main counts ----
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentRes, teacherRes, classRes] = await Promise.all([
          getStudentCount(),
          getTeacherCount(),
          getClassCount(),
        ]);

        setStats({
          students: studentRes.data.pagination.total || 0,
          teachers: teacherRes.data.pagination.total || 0,
          classes: classRes.data.total || 0,
        });
      } catch (err) {
        console.error("Dashboard API failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ---- today teacher attendance ----
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setAttLoading(true);
        const res = await getTodayTeacherAttendanceSummary(today);
        const summary = res.data?.data ?? res.data ?? {};
        console.log("attendance summary:", summary);

        setAttendance({
          present: (summary.present || []).length || 0,
          absent: (summary.absent || []).length || 0,
          late: (summary.late || []).length || 0,
          missingCheckout: (summary.missingCheckout || []).length || 0,
        });

        // build simple rows from summary.attendances
        const list: any[] = Array.isArray(summary.attendances)
          ? summary.attendances.map((a: any) => ({
              id:
                a.teacherId?._id ??
                a.teacherId ??
                a.teacher ??
                a.id,
              name: a.teacherId?.name ?? a.teacher?.name ?? "Unknown",
              email: a.teacherId?.email ?? a.teacher?.email ?? "-",
              classroom: a.classroomId
                ? `${a.classroomId.name ?? ""} ${
                    a.classroomId.code ?? ""
                  }`.trim()
                : "-",
              status: a.status ?? "PRESENT",
              checkInTime: a.checkInTime
                ? dayjs(a.checkInTime).format("hh:mm A")
                : "-",
              checkOutTime: a.checkOutTime
                ? dayjs(a.checkOutTime).format("hh:mm A")
                : "-",
              totalHours: a.totalHours ?? "-",
            }))
          : [];

        setRows(list);
      } catch (err) {
        console.error("Attendance summary failed:", err);
      } finally {
        setAttLoading(false);
      }
    };

    fetchAttendance();
  }, [today]);

  if (loading) {
    return (
      <div className="flex h-32 sm:h-40 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm text-sm sm:text-base text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  const cards = [
    {
      title: "Total Students",
      count: stats.students,
      icon: FaUsers,
      accent: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Teachers",
      count: stats.teachers,
      icon: FaChalkboardTeacher,
      accent: "bg-emerald-50 text-emerald-600",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Total Classes",
      count: stats.classes,
      icon: FaSchool,
      accent: "bg-purple-50 text-purple-600",
      iconBg: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 px-1 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Key statistics for your school at a glance.
        </p>
      </div>

      {/* Main stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`h-1 w-full ${card.accent.replace(
                  "text-",
                  "bg-"
                )}`}
              />
              <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${card.iconBg}`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-slate-500">
                    {card.title}
                  </span>
                  <span className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-semibold text-slate-900">
                    {card.count.toLocaleString()}
                  </span>
                  <span className="mt-0.5 text-[10px] sm:text-xs text-slate-400">
                    Updated just now
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today’s teacher attendance mini-section */}
      <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">
              Today&apos;s Teacher Attendance
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {dayjs(today).format("MMMM DD, YYYY")}
            </p>
          </div>
          {attLoading && (
            <span className="text-[11px] sm:text-xs text-slate-400">
              Refreshing...
            </span>
          )}
        </div>

        {/* mini stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MiniStat
            label="Present"
            value={attendance.present}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <MiniStat
            label="Absent"
            value={attendance.absent}
            color="text-rose-600"
            bg="bg-rose-50"
          />
          <MiniStat
            label="Late"
            value={attendance.late}
            color="text-amber-600"
            bg="bg-amber-50"
          />
          <MiniStat
            label="Missing Checkout"
            value={attendance.missingCheckout}
            color="text-orange-600"
            bg="bg-orange-50"
          />
        </div>

        {/* Teacher list (today) */}
        <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900">
              Today&apos;s Teacher Details
            </h3>
            {!attLoading && (
              <span className="text-[10px] sm:text-xs text-slate-400">
                {rows.length} record{rows.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {attLoading ? (
            <p className="text-[11px] sm:text-xs text-slate-400">
              Loading teacher attendance...
            </p>
          ) : rows.length === 0 ? (
            <p className="text-[11px] sm:text-xs text-slate-400">
              No attendance records for today.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-[11px] sm:text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                    <th className="px-2 py-2 text-left">Teacher</th>
                    <th className="px-2 py-2 text-left hidden sm:table-cell">
                      Class
                    </th>
                    <th className="px-2 py-2 text-center">Status</th>
                    <th className="px-2 py-2 text-center hidden sm:table-cell">
                      In
                    </th>
                    <th className="px-2 py-2 text-center hidden sm:table-cell">
                      Out
                    </th>
                    <th className="px-2 py-2 text-center hidden md:table-cell">
                      Hours
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-2 py-1.5">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {r.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {r.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-1.5 hidden sm:table-cell text-slate-700">
                        {r.classroom}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            r.status === "LATE"
                              ? "bg-amber-50 text-amber-700"
                              : r.status === "ABSENT"
                              ? "bg-rose-50 text-rose-700"
                              : r.status === "MISSING_CHECKOUT"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-center hidden sm:table-cell text-slate-700">
                        {r.checkInTime}
                      </td>
                      <td className="px-2 py-1.5 text-center hidden sm:table-cell text-slate-700">
                        {r.checkOutTime}
                      </td>
                      <td className="px-2 py-1.5 text-center hidden md:table-cell text-slate-700">
                        {r.totalHours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type MiniStatProps = {
  label: string;
  value: number;
  color: string;
  bg: string;
};

const MiniStat: React.FC<MiniStatProps> = ({ label, value, color, bg }) => {
  return (
    <div
      className={`flex flex-col rounded-xl ${bg} px-3 py-2 sm:px-4 sm:py-3 border border-slate-100`}
    >
      <span className="text-[10px] sm:text-xs font-medium text-slate-500">
        {label}
      </span>
      <span className={`mt-0.5 text-base sm:text-lg font-semibold ${color}`}>
        {value}
      </span>
    </div>
  );
};

export default Dashboard;
