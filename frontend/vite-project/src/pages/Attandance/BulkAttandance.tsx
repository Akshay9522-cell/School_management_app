import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getClasses } from "../../api/classApi";
import { getStudents, type IStudent } from "../../api/studentApi";   // <-- IMPORTED
import { bulkAttendance, type IBulkAttendance, type AttendanceStatus } from "../../api/attandanceApi";

interface IClass {
  _id: string;
  name: string;
  section: string;
}

const BulkAttendance: React.FC = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState<IClass[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");

  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [attendanceStatus, setAttendanceStatus] = useState<
    Record<string, AttendanceStatus>
  >({});

  // Fetch class list
  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const res = await getClasses();
        setClasses(res.data.classes || []);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    };
    fetchAllClasses();
  }, []);

  // Fetch students when class is selected
  useEffect(() => {
    const fetchClassStudents = async () => {
      if (!selectedClass) return;

      try {
        const res = await getStudents({ classId: selectedClass });

        const list: IStudent[] = res.data.data || [];
        setStudents(list);

        // initialize attendance status
        const initial: Record<string, AttendanceStatus> = {};
        list.forEach((s) => {
          if (s._id) initial[s._id] = "present";
        });

        setAttendanceStatus(initial);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
    fetchClassStudents();
  }, [selectedClass]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClass) {
      alert("Please select a class");
      return;
    }

    const bulkData: IBulkAttendance = {
      classId: selectedClass,
      date,
      students: students
        .filter((s) => s._id)
        .map((s) => ({
          student: s._id!,
          status: attendanceStatus[s._id!],
        })),
    };

    try {
      await bulkAttendance(bulkData);
      alert("Attendance saved successfully!");
      navigate("/dashboard/attendance");
    } catch (err) {
      console.error("Failed to save attendance:", err);
      alert("Failed to save attendance");
    }
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Bulk Attendance</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Class selection */}
        <div>
          <label className="block font-medium mb-1">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} - {c.section}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Student list */}
        {students.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Students</h2>
            <div className="space-y-2 border p-2 rounded max-h-96 overflow-y-auto">
              {students.map((s) => (
                <div key={s._id!} className="flex justify-between items-center">
                  <span>
                    {s.name} ({s.rollNo})
                  </span>
                  <select
                    value={attendanceStatus[s._id!]}
                    onChange={(e) =>
                      handleStatusChange(
                        s._id!,
                        e.target.value as AttendanceStatus
                      )
                    }
                    className="border px-2 py-1 rounded"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Save Attendance
        </button>
      </form>
    </div>
  );
};

export default BulkAttendance;
