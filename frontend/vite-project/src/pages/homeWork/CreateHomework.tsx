import { useState, type FormEvent, type ChangeEvent, useEffect } from "react";
import { createHomeworkApi, type HomeworkPayload } from "../../api/homeworkApi";
import { getClasses } from "../../api/classApi";
import { getTeachers } from "../../api/teacherApi";
import { useNavigate } from "react-router-dom";

interface ClassType {
  _id: string;
  name?: string;
  section?: string;
}

interface TeacherType {
  _id: string;
  name: string;
  email?: string;
  subject?: string;
}

const CreateHomework = () => {
  const [form, setForm] = useState<HomeworkPayload>({
    classId: "",
    subject: "",
    teacherId: "",
    title: "",
    description: "",
    dueDate: "",
    attachment: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [classes, setClasses] = useState<ClassType[]>([]);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);

  // selected class + teacher objects
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherType | null>(null);
  const navigate=useNavigate()
  useEffect(() => {
    loadClasses();
    loadTeachers();
  }, []);

  async function loadClasses() {
    try {
      const res = await getClasses({});
      setClasses(res.data.classes || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadTeachers() {
    try {
      const res = await getTeachers({});
      setTeachers(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // when class dropdown changes
    if (name === "classId") {
      const cls = classes.find((c) => c._id === value) || null;
      setSelectedClass(cls);
   
    }

    // when teacher dropdown changes
    if (name === "teacherId") {
      const t = teachers.find((te) => te._id === value) || null;
      setSelectedTeacher(t);
   
    }

    // always keep ids in form for API
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await createHomeworkApi(form);
      setMessage("Homework assigned successfully.");
      navigate(`/dashboard/class-hw/${form.classId}`)
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to assign homework.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white">
      <div className="w-full max-w-2xl p-8 rounded-2xl bg-white/10 border border-white/10 shadow-2xl backdrop-blur-xl">
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
          Assign Homework
        </h1>

        {message && (
          <div className="mb-4 rounded-lg bg-emerald-500/10 text-emerald-300 px-4 py-2 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 text-red-300 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Class dropdown */}
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Class
            </label>
            <select
              name="classId"
              value={form.classId}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} {c.section ? `- ${c.section}` : ""}
                </option>
              ))}
            </select>
            {selectedClass && (
              <p className="mt-1 text-[11px] text-slate-300">
                Selected: {selectedClass.name}{" "}
                {selectedClass.section ? `(${selectedClass.section})` : ""}
              </p>
            )}
          </div>

          {/* Teacher dropdown */}
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Teacher
            </label>
            <select
              name="teacherId"
              value={form.teacherId}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Select teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} {t.subject ? `(${t.subject})` : ""}
                </option>
              ))}
            </select>
            {selectedTeacher && (
              <p className="mt-1 text-[11px] text-slate-300">
                Selected: {selectedTeacher.name}{" "}
                {selectedTeacher.subject ? `- ${selectedTeacher.subject}` : ""}
              </p>
            )}
          </div>

          {/* Rest of your fields are unchanged */}
          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Subject
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. Mathematics"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Chapter 5 exercise"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              rows={3}
              placeholder="Enter homework details"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate ?? ""}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Attachment (URL)
            </label>
            <input
              name="attachment"
              value={form.attachment}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="https://..."
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:from-sky-400 hover:via-indigo-400 hover:to-fuchsia-400 transition-all disabled:opacity-60"
            >
              {loading ? "Assigning..." : "Assign Homework"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHomework;
