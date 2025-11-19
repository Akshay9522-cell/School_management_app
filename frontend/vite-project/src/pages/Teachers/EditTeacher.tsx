import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTeacherById, updateTeacher } from "../../api/teacherApi";


const EditTeacher: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    joiningDate: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch teacher by ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTeacherById(id as string);
        const t = res.data.data; 
        console.log(t)

        setForm({
          name: t.name,
          email: t.email,
          subject: t.subject,
          joiningDate: t.joiningDate?.substring(0, 10), // Fix for input type date
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle Change
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  console.log(form)

  // Submit Update
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await updateTeacher(id as string, form);
      console.log(id,form)
      alert("Teacher updated successfully!");
      navigate("/dashoard/teachers/"); // redirect to list
    } catch (error) {
      console.error(error);
      alert("Failed to update teacher");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
   
      <div className="container mx-auto mt-6 p-6 bg-white shadow-lg rounded">
        <h2 className="text-2xl font-bold mb-4">Edit Teacher</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Update Teacher
          </button>
        </form>
      </div>
  
  );
};

export default EditTeacher;
