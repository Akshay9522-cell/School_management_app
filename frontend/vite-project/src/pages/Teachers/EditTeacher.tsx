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

        setForm({
          name: t.name || "",
          email: t.email || "",
          subject: t.subject || "",
          joiningDate: t.joiningDate ? t.joiningDate.substring(0, 10) : "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Handle Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateTeacher(id as string, form);
      alert("Teacher updated successfully!");
      navigate("/dashboard/teachers"); // Fixed redirect path
    } catch (error) {
      console.error(error);
      alert("Failed to update teacher");
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 lg:p-10 flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400 text-lg">Loading teacher data...</div>
      </div>
    );
  }

  const inputGlass =
    "w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 shadow-sm shadow-slate-900/50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500";

  return (
    <div className="p-6 md:p-8 lg:p-10">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Edit Teacher
          </h1>
          <p className="text-sm text-slate-400">
            Update teacher details and save changes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/teachers")}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
        >
          ← Back to Teachers
        </button>
      </div>

      {/* Glass card */}
      <div className="mx-auto max-w-2xl relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-slate-900/50">
        {/* Top gradient strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputGlass}
                placeholder="Enter teacher name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={inputGlass}
                placeholder="teacher@example.com"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Primary Subject
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className={inputGlass}
                placeholder="Mathematics, English, Science..."
                required
              />
            </div>

            {/* Joining Date */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Joining Date
              </label>
              <input
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                className={`${inputGlass} [color-scheme:dark]`}
                required
              />
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-tr from-emerald-500 via-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 hover:from-emerald-400 hover:via-sky-400 hover:to-indigo-400 transition-all duration-200"
              >
                Update Teacher
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTeacher;
