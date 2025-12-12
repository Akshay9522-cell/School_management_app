// src/pages/StudentDailyAttendance.tsx
import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import { getStudentsByClass } from "../../api/studentApi";
import { markDailyAttendance } from "../../api/studentDailyAttendanceApi";
import dayjs from "dayjs";

type AttendanceData = {
  status: "present" | "absent";
  homework: "done" | "not_done";
};

type TestInput = {
  subject: string;
  marks: string;
  total: string;
};

export default function StudentDailyAttendance() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceData>>(
    {}
  );

  const [openTestForStudent, setOpenTestForStudent] = useState<string | null>(
    null
  );
  const [testInput, setTestInput] = useState<TestInput>({
    subject: "",
    marks: "",
    total: "",
  });

  const [testMarks, setTestMarks] = useState<
    Record<
      string,
      {
        subject: string;
        marks: number;
        total: number;
      }[]
    >
  >({});

  const [submitting, setSubmitting] = useState(false);

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
        homework: "not_done",
      };
    });
    setAttendance(defaultAttendance);
    setTestMarks({});
  };

  const markAttendance = (id: string, status: "present" | "absent") => {
    setAttendance((prev) => ({
      ...prev,
      [id]: { ...prev[id], status },
    }));
  };

  const toggleHomework = (id: string) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        homework: prev[id]?.homework === "done" ? "not_done" : "done",
      },
    }));
  };

  const handleOpenTestBox = (studentId: string) => {
    setOpenTestForStudent(studentId);
    setTestInput({ subject: "", marks: "", total: "" });
  };

  const handleSaveTestMarks = () => {
    if (!openTestForStudent) return;

    if (!testInput.subject || !testInput.marks || !testInput.total) {
      alert("Please fill all test fields");
      return;
    }

    const marksNum = Number(testInput.marks);
    const totalNum = Number(testInput.total);
    if (Number.isNaN(marksNum) || Number.isNaN(totalNum)) {
      alert("Marks and total must be numbers");
      return;
    }

    setTestMarks((prev) => {
      const prevList = prev[openTestForStudent] || [];
      return {
        ...prev,
        [openTestForStudent]: [
          ...prevList,
          {
            subject: testInput.subject,
            marks: marksNum,
            total: totalNum,
          },
        ],
      };
    });

    setOpenTestForStudent(null);
  };

  const submitAttendance = async () => {
    if (!selectedClass) return alert("Select class first!");

    const records = Object.entries(attendance).map(([studentId, data]) => ({
      studentId,
      status: data.status,
      homework: data.homework,
      tests: testMarks[studentId] || [],
    }));

    const payload = {
      classId: selectedClass,
      date: dayjs().format("YYYY-MM-DD"),
      records,
    };

    try {
      setSubmitting(true);
      const res = await markDailyAttendance(payload);

      if (res.data.success) {
        alert("Attendance Submitted Successfully!");
      } else {
        alert(res.data.message || "Error submitting attendance");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting attendance");
    } finally {
      setSubmitting(false);
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
              Mark presence, homework, and test marks for each student.
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
            const homeworkDone = studentAttendance.homework === "done";
            const testsForStudent = testMarks[student._id] || [];

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
                      Roll: {student.rollNumber || "-"}
                    </p>
                  </div>

                  {/* Small button to open test marks box */}
                  <button
                    type="button"
                    onClick={() => handleOpenTestBox(student._id)}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Upload Test marks
                  </button>
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

                  {testsForStudent.length > 0 && (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                      {testsForStudent.length} test
                      {testsForStudent.length > 1 ? "s" : ""} added
                    </span>
                  )}
                </div>

                {/* Show list of tests (optional) */}
                {testsForStudent.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {testsForStudent.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg bg-indigo-50 px-2 py-1 text-[11px] text-indigo-800"
                      >
                        <span className="font-semibold">{t.subject}</span>
                        <span>
                          {t.marks}/{t.total}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Attendance toggle buttons */}
                <div className="mb-3 inline-flex rounded-full bg-slate-100 p-1 text-xs">
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

                {/* Homework checkbox */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer h-5 w-5 cursor-pointer rounded border border-slate-300 text-blue-600 transition-all checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-500/40"
                        checked={homeworkDone}
                        onChange={() => toggleHomework(student._id)}
                      />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-white opacity-0 peer-checked:opacity-100">
                        ✓
                      </span>
                    </label>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">
                        Homework done
                      </span>
                      <span className="text-xs text-slate-400">
                        Tick if today&apos;s homework is completed
                      </span>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      homeworkDone
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {homeworkDone ? "Done" : "Not done"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit button */}
        {students.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              disabled={submitting}
              onClick={submitAttendance}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/60 ${
                submitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              <span>{submitting ? "Submitting..." : "Submit Attendance"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Small modal for test marks */}
      {openTestForStudent && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Add test marks
            </h3>

            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Subject name
              </label>
              <input
                type="text"
                value={testInput.subject}
                onChange={(e) =>
                  setTestInput((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="e.g. Mathematics"
              />
            </div>

            <div className="mb-4 flex gap-3">
              <div className="w-1/2">
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Marks
                </label>
                <input
                  type="number"
                  value={testInput.marks}
                  onChange={(e) =>
                    setTestInput((prev) => ({
                      ...prev,
                      marks: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="e.g. 18"
                />
              </div>
              <div className="w-1/2">
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Out of
                </label>
                <input
                  type="number"
                  value={testInput.total}
                  onChange={(e) =>
                    setTestInput((prev) => ({
                      ...prev,
                      total: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="e.g. 20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpenTestForStudent(null)}
                className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTestMarks}
                className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
