import React, { useState, useEffect } from "react";
import { getTeachers, updateTeacherSubject } from "../../api/teacherApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

type Teacher = {
  name: string;
  email: string;
  _id: string;
};

const AssignSubject = () => {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const res = await getTeachers({ all: "true" } as any);
      setTeachers(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load teachers");
    }
  };

  const validateForm = () => {
    if (!selectedTeacher) {
      toast.error("Please select a teacher");
      return false;
    }
    if (!subject) {
      toast.error("Please select a subject");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     if (!validateForm()) {
  toast.error("Please fill the form correctly");
  return;
}

    try {
      await updateTeacherSubject(selectedTeacher, subject);
      toast.success("Subject assigned successfully!");
      await loadTeachers();
      navigate("/dashboard/teachers");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to assign subject. Try again."
      );
    }
  };

  const inputGlass =
    "w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 shadow-sm shadow-slate-900/50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500 pr-8";

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-slate-200 via-slate-550 to-slate-600">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Assign Subject to Teacher
          </h2>
          <p className="text-sm text-slate-400">
            Select a teacher and assign their primary subject.
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
            {/* Teacher Dropdown */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Select Teacher
              </label>
              <select
                className={inputGlass}
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="" className="text-slate-700">
                  Choose a teacher
                </option>
                {teachers.map((t) => (
                  <option
                    key={t._id}
                    value={t._id}
                    className="text-slate-900"
                  >
                    {t.name} — {t.email}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[11px] text-slate-400">
                Select the teacher who will be assigned the subject.
              </p>
            </div>

            {/* Subject Dropdown */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Subject
              </label>
              <select
                className={inputGlass}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="" className="text-slate-700">
                  Choose subject
                </option>
                <option value="Mathematics" className="text-slate-900">
                  Mathematics
                </option>
                <option value="Science" className="text-slate-900">
                  Science
                </option>
                <option value="Physics" className="text-slate-900">
                  Physics
                </option>
                <option value="Chemistry" className="text-slate-900">
                  Chemistry
                </option>
                <option value="Biology" className="text-slate-900">
                  Biology
                </option>
                <option value="English" className="text-slate-900">
                  English
                </option>
                <option value="Hindi" className="text-slate-900">
                  Hindi
                </option>
                <option value="Sanskrit" className="text-slate-900">
                  Sanskrit
                </option>
                <option value="Social Science" className="text-slate-900">
                  Social Science
                </option>
                <option value="History" className="text-slate-900">
                  History
                </option>
                <option value="Geography" className="text-slate-900">
                  Geography
                </option>
                <option value="Civics" className="text-slate-900">
                  Civics
                </option>
                <option value="Economics" className="text-slate-900">
                  Economics
                </option>
                <option value="Computer Science" className="text-slate-900">
                  Computer Science
                </option>
                <option value="Information Technology" className="text-slate-900">
                  Information Technology
                </option>
                <option value="Environmental Science" className="text-slate-900">
                  Environmental Science
                </option>
                <option value="Moral Science" className="text-slate-900">
                  Moral Science
                </option>
                <option value="Physical Education" className="text-slate-900">
                  Physical Education
                </option>
                <option value="General Knowledge" className="text-slate-900">
                  General Knowledge
                </option>
                <option value="Art" className="text-slate-900">
                  Art
                </option>
                <option value="Music" className="text-slate-900">
                  Music
                </option>
                <option value="Dance" className="text-slate-900">
                  Dance
                </option>
                <option value="Commerce" className="text-slate-900">
                  Commerce
                </option>
                <option value="Accountancy" className="text-slate-900">
                  Accountancy
                </option>
                <option value="Business Studies" className="text-slate-900">
                  Business Studies
                </option>
                <option value="Home Science" className="text-slate-900">
                  Home Science
                </option>
                <option value="Psychology" className="text-slate-900">
                  Psychology
                </option>
                <option value="Political Science" className="text-slate-900">
                  Political Science
                </option>
              </select>
              <p className="mt-1.5 text-[11px] text-slate-400">
                This will be the teacher's primary subject assignment.
              </p>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!selectedTeacher || !subject}
              >
                Assign Subject
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster/>
    </div>
  );
};

export default AssignSubject;
