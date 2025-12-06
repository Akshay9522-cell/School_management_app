import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

interface TeacherForm {
  name: string;
  email: string;
  phone: string;
  qualification: string;
  subject: string;
  userId: string;
}

export default function AddTeacherPage() {
  const [form, setForm] = useState<TeacherForm>({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    subject: "",
    userId: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const name = searchParams.get("name");
  const email = searchParams.get("email");

  useEffect(() => {
    if (userId) {
      setForm((prev) => ({
        ...prev,
        userId: userId,
        name: name || "",
        email: email || "",
      }));
    }
  }, [userId, name, email]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = Cookies.get("token");

      const res = await axios.post(
        "http://localhost:4000/api/teachers/add",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Teacher added successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        qualification: "",
        subject: "",
        userId: Cookies.get("userId") || "",
      });
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error adding teacher");
    }

    setLoading(false);
  };

  const inputGlass =
    "w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 shadow-sm shadow-slate-900/50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500";

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-slate-200 via-slate-550 to-slate-600">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Add Teacher
          </h1>
          <p className="text-sm text-slate-400">
            Fill in the teacher details to register a new faculty member.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 rounded-xl p-4 text-sm backdrop-blur-md ${
            message.includes("successfully")
              ? "bg-emerald-500/90 text-white border border-emerald-500/50 shadow-lg shadow-emerald-500/40"
              : "bg-rose-500/90 text-white border border-rose-500/50 shadow-lg shadow-rose-500/40"
          }`}
        >
          {message}
        </div>
      )}

      {/* Glass card */}
      <div className="mx-auto max-w-4xl relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-slate-900/50">
        {/* Top gradient strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={inputGlass}
                placeholder="Phone number"
                required
              />
            </div>

            {/* Qualification */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                className={inputGlass}
                placeholder="Ex: B.Ed, M.Sc, M.A."
                required
              />
            </div>

            {/* Subject */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Primary Subject
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className={`${inputGlass} md:col-span-2`}
                placeholder="English, Mathematics, Science, History..."
                required
              />
            </div>

            {/* User ID (readonly) */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                User ID (Auto-filled)
              </label>
              <input
                type="text"
                name="userId"
                value={form.userId}
                readOnly
                className={`${inputGlass} bg-slate-900/90 border-white/10 cursor-not-allowed`}
              />
              <p className="mt-1.5 text-[11px] text-slate-400">
                This is auto-filled from the user registration link.
              </p>
            </div>

            {/* Submit button */}
            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Adding Teacher..." : "Add Teacher"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
