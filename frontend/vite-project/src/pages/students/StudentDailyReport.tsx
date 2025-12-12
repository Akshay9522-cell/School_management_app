import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import { getStudentsByClass } from "../../api/studentApi";
import axios from "axios";

import dayjs from "dayjs";

type HomeworkStatus = "complete" | "incomplete";

type TestInput = {
  subject: string;
  marks: string;
  total: string;
};

type StudentTests = {
  subject: string;
  marks: number;
  total: number;
}[];

export default function StudentDailyReports() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<any[]>([]);

  const [homework, setHomework] = useState<Record<string, HomeworkStatus>>({});
  const [tests, setTests] = useState<Record<string, StudentTests>>({});

  const [openTestForStudent, setOpenTestForStudent] = useState<string | null>(
    null
  );
  const [testInput, setTestInput] = useState<TestInput>({
    subject: "",
    marks: "",
    total: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getClasses({ limit: 1000, page: 1 }).then((res) => {
      setClasses(res.data.classes || []);
    });
  }, []);

  const fetchStudents = async (classId: string) => {
    setSelectedClass(classId);
    if (!classId) {
      setStudents([]);
      setHomework({});
      setTests({});
      return;
    }
    const res = await getStudentsByClass(classId);
    const studentList = res?.data?.data || [];
    setStudents(studentList);

    const hw: Record<string, HomeworkStatus> = {};
    studentList.forEach((s: any) => {
      hw[s._id] = "incomplete";
    });
    setHomework(hw);
    setTests({});
  };

  const toggleHomework = (studentId: string) => {
    setHomework((prev) => ({
      ...prev,
      [studentId]:
        prev[studentId] === "complete" ? "incomplete" : "complete",
    }));
  };

  const handleOpenTestBox = (studentId: string) => {
    setOpenTestForStudent(studentId);
    setTestInput({ subject: "", marks: "", total: "" });
  };

  const handleSaveTest = () => {
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

    setTests((prev) => {
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

  const submitDailyReport = async () => {
    if (!selectedClass) {
      alert("Select class first!");
      return;
    }

    // build homework array
    const homeworkPayload = students.map((s: any) => ({
      studentId: s._id,
      status: homework[s._id] || "incomplete",
    }));

    // group tests by subject + total so backend can create 1 TestResult per test
    const testByKey: Record<
      string,
      {
        subject: string;
        totalMarks: number;
        records: { studentId: string; marks: number }[];
      }
    > = {};

    Object.entries(tests).forEach(([studentId, studentTests]) => {
      (studentTests || []).forEach((t) => {
        const key = `${t.subject}__${t.total}`;
        if (!testByKey[key]) {
          testByKey[key] = {
            subject: t.subject,
            totalMarks: t.total,
            records: [],
          };
        }
        testByKey[key].records.push({
          studentId,
          marks: t.marks,
        });
      });
    });

    const testsPayload = Object.values(testByKey);

    const payload = {
      classId: selectedClass,
      date: dayjs().format("YYYY-MM-DD"),
      homework: homeworkPayload,
      tests: testsPayload, // may be [] if no tests today
    };

    try {
      setSubmitting(true);
      let api="http://localhost:4000/api/daily-Report/report"
      const res = await axios.post(api, payload);
      if (res.data.success) {
        alert("Daily report submitted successfully");
      } else {
        alert(res.data.message || "Error submitting daily report");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while submitting daily report");
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
              Student Daily Reports
            </h2>
            <p className="text-sm text-slate-500">
              Select a class, then mark homework and add test data.
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

        {/* Desktop table / mobile cards */}
        {students.length > 0 ? (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm md:block">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-slate-700">
                      #
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-700">
                      Roll No
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-700">
                      Homework
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-700">
                      Test data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student: any, idx: number) => {
                    const hwStatus = homework[student._id] || "incomplete";
                    const studentTests = tests[student._id] || [];
                    const hwComplete = hwStatus === "complete";

                    return (
                      <tr key={student._id} className="hover:bg-slate-50">
                        <td className="px-4 py-2 text-slate-600">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2 text-slate-800">
                          {student.name}
                        </td>
                        <td className="px-4 py-2 text-slate-600">
                          {student.rollNo || "-"}
                        </td>
                        {/* Homework toggle */}
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => toggleHomework(student._id)}
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              hwComplete
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {hwComplete ? "Complete" : "Not complete"}
                          </button>
                        </td>
                        {/* Test data button */}
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenTestBox(student._id)}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              Add test
                            </button>
                            {studentTests.length > 0 && (
                              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                                {studentTests.length} added
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="grid gap-3 md:hidden">
              {students.map((student: any, idx: number) => {
                const hwStatus = homework[student._id] || "incomplete";
                const studentTests = tests[student._id] || [];
                const hwComplete = hwStatus === "complete";

                return (
                  <div
                    key={student._id}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {idx + 1}. {student.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Roll: {student.rollNo || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Homework
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleHomework(student._id)}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${
                          hwComplete
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {hwComplete ? "Complete" : "Not complete"}
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Test data
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenTestBox(student._id)}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          Add
                        </button>
                        {studentTests.length > 0 && (
                          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                            {studentTests.length} added
                          </span>
                        )}
                      </div>
                    </div>

                    {studentTests.length > 0 && (
                      <div className="mt-2 rounded-lg bg-slate-50 px-2 py-1">
                        <p className="text-[11px] font-medium text-slate-600">
                          Last test:
                        </p>
                        <p className="text-[11px] text-slate-700">
                          {
                            studentTests[studentTests.length - 1]
                              .subject
                          }{" "}
                          –{" "}
                          {
                            studentTests[studentTests.length - 1]
                              .marks
                          }
                          /
                          {
                            studentTests[studentTests.length - 1]
                              .total
                          }
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit button */}
            <div className="mt-6 flex justify-end">
              <button
                disabled={submitting}
                onClick={submitDailyReport}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/60 ${
                  submitting
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                {submitting ? "Submitting..." : "Submit Daily Report"}
              </button>
            </div>
          </>
        ) : selectedClass ? (
          <p className="text-sm text-slate-500">
            No students found for this class.
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Please select a class to see students.
          </p>
        )}
      </div>

      {/* Test modal */}
      {openTestForStudent && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 px-3 pb-6 md:items-center md:px-0 md:pb-0">
          <div className="w-full max-w-sm rounded-t-2xl bg-white p-4 shadow-xl md:rounded-2xl">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Add test data
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
                placeholder="e.g. English"
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
                onClick={handleSaveTest}
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
