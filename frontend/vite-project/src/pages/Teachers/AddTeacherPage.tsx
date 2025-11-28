import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

// ✅ FIX: Add this interface
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Teacher</h1>

      {message && (
        <p className="mb-4 p-3 rounded bg-blue-100 text-blue-700">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 shadow rounded"
      >
        {/* ---- Name ---- */}
        <div>
          <label className="block text-sm font-semibold">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter teacher name"
            required
          />
        </div>

        {/* ---- Email ---- */}
        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter email"
            required
          />
        </div>

        {/* ---- Phone ---- */}
        <div>
          <label className="block text-sm font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter phone number"
            required
          />
        </div>

        {/* ---- Qualification ---- */}
        <div>
          <label className="block text-sm font-semibold">Qualification</label>
          <input
            type="text"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Ex: B.Ed, M.Sc"
            required
          />
        </div>

        {/* ---- Experience ---- */}
        <div>
          <label className="block text-sm font-semibold">Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="English,history"
            required
          />
        </div>

        {/* ---- Auto-filled UserID ---- */}
        <div>
          <label className="block text-sm font-semibold">User ID (Auto)</label>
          <input
            type="text"
            name="userId"
            value={form.userId}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Teacher"}
        </button>
      </form>
    </div>
  );
}
