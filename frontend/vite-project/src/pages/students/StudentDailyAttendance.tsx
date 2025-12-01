import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import { getStudentsByClass } from "../../api/studentApi";
import { markDailyAttendance } from "../../api/studentDailyAttendanceApi";
import dayjs from "dayjs";

export default function StudentDailyAttendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
 const [students, setStudents] = useState<any[]>([]);
 const [attendance, setAttendance] = useState<Record<string, "present" | "absent">>({});


  useEffect(() => {
  getClasses({ limit: 1000, page: 1}).then((res) => {
    console.log("🔥 CLASS API RESPONSE:", res.data.classes);
    setClasses(res.data.classes|| []);
  });
}, []);

  const fetchStudents = async (classId: string) => {
  setSelectedClass(classId);

  const res = await getStudentsByClass(classId)
  console.log(res)

  const studentList = res?.data?.data || []; // 🔥 safe
  setStudents(studentList);
  

  const defaultAttendance: Record<string, "present" | "absent"> = {};
  studentList.forEach((s: any) => {
    defaultAttendance[s._id] = "present";
  });

  setAttendance(defaultAttendance);
};

  const markAttendance = (id: string, status: string) => {
    setAttendance((prev: any) => ({
      ...prev,
      [id]: status,
    }));
  };
  console.log(attendance)

 const submitAttendance = async () => {
  if (!selectedClass) return alert("Select class first!");

  const records = Object.entries(attendance).map(([studentId, status]) => ({
    studentId,
    status,
  }));

  const payload = {
    classId: selectedClass,
    date: dayjs().format("YYYY-MM-DD"),
    records,
  };

  console.log("FINAL PAYLOAD:", payload);

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
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Daily Student Attendance</h2>

      <select
        className="border p-2 rounded mb-4"
        onChange={(e) => fetchStudents(e.target.value)}
      >
        <option value="">Select Class</option>
        {classes.map((cls: any) => (
          <option key={cls._id} value={cls._id}>
            {cls.name}-{cls.section}
          </option>
        ))}
      </select>

      <div className="space-y-3">
        {students.map((student: any) => (
          <div
            key={student._id}
            className="flex items-center justify-between border p-3 rounded"
          >
            <span className="font-semibold">{student.name}</span>

            <div className="flex gap-3">
              <button
                onClick={() => markAttendance(student._id, "present")}
                className={`px-3 py-1 rounded ${
                  attendance[student._id] === "present"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Present
              </button>

              <button
                onClick={() => markAttendance(student._id, "absent")}
                className={`px-3 py-1 rounded ${
                  attendance[student._id] === "absent"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>

      {students.length > 0 && (
        <button
          onClick={submitAttendance}
          className="mt-5 px-5 py-2 bg-blue-600 text-white rounded"
        >
          Submit Attendance
        </button>
      )}
    </div>
  );
}
