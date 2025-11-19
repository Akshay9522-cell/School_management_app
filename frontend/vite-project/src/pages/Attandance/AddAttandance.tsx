import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClasses } from "../../api/classApi";
import { getStudents } from "../../api/studentApi";
import { addAttendance, type AttendanceStatus } from "../../api/attandanceApi";

interface IForm {
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
}

const STATUS_OPTIONS: AttendanceStatus[] = ["present", "absent", "leave"];

const AddAttendance: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<IForm>({
    studentId: "",
    classId: "",
    date: new Date().toISOString().split("T")[0],
    status: "present",
  });

  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClasses();
        setClasses(res.data.classes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!form.classId) return;
    const fetchStudentsByClass = async () => {
      try {
        const res = await getStudents({ classId: form.classId });
        setStudents(res.data.data || []); // fix response mapping
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudentsByClass();
  }, [form.classId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "status" ? (value as AttendanceStatus) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.classId || !form.date) return alert("Fill all required fields");
    try {
      await addAttendance({
        student: form.studentId,
        class: form.classId,
        date: form.date,
        status: form.status,
      });
      alert("Attendance added successfully!");
      navigate("/dashboard/attendance");
    } catch (err) {
      console.error(err);
      alert("Failed to add attendance");
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">Add Attendance</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="classId" value={form.classId} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c._id} value={c._id}>{c.name} - {c.section}</option>
          ))}
        </select>

        <select name="studentId" value={form.studentId} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option value="">Select Student</option>
          {students.map(s => (
            <option key={s._id} value={s._id}>{s.name} - {s.rollNo}</option>
          ))}
        </select>

        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

        <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Add Attendance</button>
      </form>
    </div>
  );
};

export default AddAttendance;
