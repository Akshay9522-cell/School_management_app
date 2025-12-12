import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import { getStudentsByClass } from "../../api/studentApi";
import { markDailyAttendance } from "../../api/studentDailyAttendanceApi";
import dayjs from "dayjs";

type AttendanceData = {
  status: "present" | "absent";
};

export default function StudentDailyAttendance() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceData>>(
    {}
  );

  useEffect(() => {
    getClasses({ limit: 1000, page: 1 }).then((res) => {
      setClasses(res.data.classes || []);
    });
  }, []);

  const fetchStudents = async (classId: string) => {
    setSelectedClass(classId);

    const res = await getStudentsByClass(classId);
    const studentList = res?.data?.data || [];
    setStudents(studentList);

    const defaultAttendance: Record<string, AttendanceData> = {};
    studentList.forEach((s: any) => {
      defaultAttendance[s._id] = {
        status: "present",
      };
    });
    setAttendance(defaultAttendance);
  };

  const markAttendance = (id: string, status: "present" | "absent") => {
    setAttendance((prev) => ({
      ...prev,
      [id]: { ...prev[id], status },
    }));
  };

  const submitAttendance = async () => {
    if (!selectedClass) return alert("Select class first!");

    const records = Object.entries(attendance).map(([studentId, data]) => ({
      studentId,
      status: data.status,
    }));

    const payload = {
      classId: selectedClass,
      date: dayjs().format("YYYY-MM-DD"),
      records,
    };

    try {
      const res = await markDailyAttendance(payload);

      if (res.data.success) {
        alert("Attendance Submitted Successfully!");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting attendance");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Daily Student Attendance
            </h2>
            <p className="text-sm text-slate-500">
              Mark presence for each student.
            </p>
          </div>

          {/* Class selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600">
              Select Class
            </label>
            <select
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              onChange={(e) => fetchStudents(e.target.value)}
              value={selectedClass}
            >
              <option value="">Choose...</option>
              {classes.map((cls: any) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}-{cls.section}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Students grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student: any) => {
            const studentAttendance = attendance[student._id] || {};
            const isPresent = studentAttendance.status === "present";

            return (
              <div
                key={student._id}
                className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {student.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Roll: {student.rollNo || "-"}
                    </p>
                  </div>
                </div>

                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      isPresent
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {isPresent ? "Present" : "Absent"}
                  </span>
                </div>

                {/* Attendance toggle buttons */}
                <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => markAttendance(student._id, "present")}
                    className={`rounded-full px-3 py-1 font-medium transition ${
                      isPresent
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    onClick={() => markAttendance(student._id, "absent")}
                    className={`rounded-full px-3 py-1 font-medium transition ${
                      !isPresent
                        ? "bg-rose-500 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit button */}
        {students.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={submitAttendance}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/60"
            >
              <span>Submit Attendance</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
