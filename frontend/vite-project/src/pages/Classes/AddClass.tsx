import React, { useEffect, useState } from "react";
import { addClass } from "../../api/classApi";
import { getTeachers } from "../../api/teacherApi";
import { useNavigate } from "react-router-dom";

const AddClass: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",          // ✅ changed from className to name
    section: "",
    classTeacher: "",
  });

  const [teachers, setTeachers] = useState<any[]>([]);

  // Fetch teacher list
  const fetchTeachers = async () => {
    try {
      const res = await getTeachers({});
      setTeachers(res.data.data);
      console.log(teachers)
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!form.name || !form.section || !form.classTeacher) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addClass(form); // ✅ now matches backend schema
      alert("Class added successfully!");
      navigate("/dashboard/classes"); // redirect to class list
    } catch (err) {
      console.error("Failed to add class:", err);
      alert("Failed to add class");
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">Add Class</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Class Name */}
        <div>
          <label className="block font-medium">Class Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter class name"
          />
        </div>

        {/* Section */}
        <div>
          <label className="block font-medium">Section</label>
          <input
            type="text"
            name="section"
            value={form.section}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter section"
          />
        </div>

        {/* Teacher Dropdown */}
        <div>
          <label className="block font-medium">Class Teacher</label>
          <select
            name="classTeacher"
            value={form.classTeacher}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Teacher</option>
            {teachers.map((t: any) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Add Class
        </button>
      </form>
    </div>
  );
};

export default AddClass;
