import { useEffect, useState } from "react";
import { addStudent } from "../../api/studentApi";
import { getClasses } from "../../api/classApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

interface ClassType {
  _id: string;
  name?: string;
  section?: string;
}

const AddStudent = () => {
  const navigate = useNavigate();

  const [myclass, setMyclass] = useState<ClassType[]>([]);
  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    parentName: "",
    parentPhone: "",
    admissionNo: "",
    dob: "",
    gender: "",
    classId: "",
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const res = await getClasses({ page: 1, limit: 1000 });
      setMyclass(res.data.classes || []);
    } catch (e) {
      toast.error("Failed to load classes");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // name
    if (!student.name.trim()) {
      toast.error("Student name is required");
      return false;
    }

    // email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!student.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!emailRegex.test(student.email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    // phone
    if (!student.phone.trim()) {
      toast.error("Student phone is required");
      return false;
    }
    if (student.phone.trim().length < 10) {
      toast.error("Student phone must be at least 10 digits");
      return false;
    }

    // parent name
    if (!student.parentName.trim()) {
      toast.error("Parent / guardian name is required");
      return false;
    }

    // parent phone
    if (!student.parentPhone.trim()) {
      toast.error("Parent phone is required");
      return false;
    }
    if (student.parentPhone.trim().length < 10) {
      toast.error("Parent phone must be at least 10 digits");
      return false;
    }

    // admission no
    if (!student.admissionNo.trim()) {
      toast.error("Admission number is required");
      return false;
    }

    // dob
    if (!student.dob) {
      toast.error("Date of birth is required");
      return false;
    }

    // gender
    if (!student.gender) {
      toast.error("Please select gender");
      return false;
    }

    // class
    if (!student.classId) {
      toast.error("Please select class");
      return false;
    }

    // address
    if (!student.address.trim()) {
      toast.error("Address is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // client-side validation
  if (!validateForm()) {
  toast.error("Please fill the form correctly");
  return;
}


    try {
      await addStudent(student);
      toast.success("Student added successfully!");
      navigate("/dashboard/students");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to add student. Try again."
      );
    }
  };

  const inputBase =
    "w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 shadow-sm shadow-slate-900/50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500";

  return (
    <div className="p-6 md:p-8 lg:p-10">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-black tracking-tight">
            Add Student
          </h2>
          <p className="text-sm text-slate-400">
            Fill in the details to register a new student.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Glass card */}
      <div className="mx-auto max-w-4xl relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-slate-900/50">
        {/* Top gradient strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />

        <div className="p-5 md:p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Name */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-700">
                Full Name
              </label>
              <input
                name="name"
                placeholder="Student name"
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="student@example.com"
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-700">
                Phone
              </label>
              <input
                name="phone"
                placeholder="Phone number"
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            {/* Admission No */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-700">
                Admission No
              </label>
              <input
                name="admissionNo"
                placeholder="Admission number"
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            {/* Parent name */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-700">
                Parent / Guardian Name
              </label>
              <input
                name="parentName"
                placeholder="Parent name"
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            {/* Parent phone */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-700">
                Parent Phone
              </label>
              <input
                name="parentPhone"
                placeholder="Parent contact"
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            {/* DOB */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                onChange={handleChange}
                className={`${inputBase} [color-scheme:dark]`}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-700">
                Gender
              </label>
              <select
                name="gender"
                onChange={handleChange}
                className={`${inputBase} pr-8`}
              >
                <option value="" className="text-slate-700">
                  Select gender
                </option>
                <option value="Male" className="text-slate-900">
                  Male
                </option>
                <option value="Female" className="text-slate-900">
                  Female
                </option>
                <option value="Other" className="text-slate-900">
                  Other
                </option>
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-700">
                Class
              </label>
              <select
                name="classId"
                onChange={handleChange}
                className={`${inputBase} pr-8`}
              >
                <option value="" className="text-slate-700">
                  Select class
                </option>
                {myclass.length > 0 ? (
                  myclass.map((cls, index) => (
                    <option
                      key={cls._id + index}
                      value={cls._id}
                      className="text-slate-900"
                    >
                      {cls.name?.trim() ? cls.name : "(No Name)"}{" "}
                      {cls.section?.trim() ? `- ${cls.section}` : ""}
                    </option>
                  ))
                ) : (
                  <option value="" disabled className="text-slate-700">
                    No classes available
                  </option>
                )}
              </select>
            </div>

            {/* Address (full width) */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-700">
                Address
              </label>
              <textarea
                name="address"
                placeholder="Full address"
                onChange={handleChange}
                className={`${inputBase} min-h-[90px] resize-none`}
              />
            </div>

            {/* Footer buttons */}
            <div className="md:col-span-2 mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/students")}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 px-6 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/40 hover:from-emerald-400 hover:to-sky-400 transition-all"
              >
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster/>
    </div>
  );
};

export default AddStudent;
