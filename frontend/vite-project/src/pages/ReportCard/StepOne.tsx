import { useEffect, useState } from "react";
import { getClassById, getClasses } from "../../api/classApi";
import { useNavigate } from "react-router-dom";

export interface Student {
  _id: string;
  name: string;
  rollNo?: number;
}

export interface Clas {
  _id?: string;
  id?: string;
  name?: string;
  section?: string;
  // optional when you fetch a single class
  students?: Student[];
}

export default function FetchStudentByClass() {
  const [classes, setClasses] = useState<Clas[]>([]);
  const [classId, setClassId] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate=useNavigate()
  // 1) Load classes once
  useEffect(() => {
    const load = async () => {
      setLoadingClasses(true);
      setError(null);
      try {
        const res = await getClasses({ limit: 100 });
        setClasses(res.data.classes || []);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load classes");
      } finally {
        setLoadingClasses(false);
      }
    };
    load();
  }, []);

  // 2) Fetch class details (students) whenever classId changes
  useEffect(() => {
    if (!classId) {
      setStudents([]);
      return;
    }

    const fetchClass = async () => {
      setLoadingStudents(true);
      setError(null);
      try {
        // Use classId state here, which is up-to-date inside this effect
        const res = await getClassById(classId);
        // adjust according to your API structure; user example used res.data.data
        const data = res.data?.data ?? res.data;
        setStudents(data?.students ?? []);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load students for selected class");
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchClass();
  }, [classId]);

  // 3) Called when select changes
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setClassId(value); // this will trigger the useEffect above
    // If you prefer to call API directly here (without effect), use getClassById(value)
  };

  return (
    <div className="w-full max-w-sm">
      <label className="block mb-2 text-sm font-medium text-slate-700">
        Choose class
      </label>

      <div className="relative">
        <select
          value={classId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select class</option>
          {loadingClasses ? (
            <option value="" disabled>
              Loading...
            </option>
          ) : (
            classes.map((item) => (
              <option key={item._id || item.id} value={item._id || item.id}>
                {item.name} - {item.section}
              </option>
            ))
          )}
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <svg
            className="h-4 w-4 text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>

      <p className="mt-1 text-xs text-slate-500">Select a class and section.</p>

      <div className="mt-4">
        <h3 className="font-medium">Students</h3>

        {loadingStudents && <div>Loading students...</div>}

        {error && <div className="text-red-500">{error}</div>}

        {!loadingStudents && students.length === 0 && classId && (
          <div>No students found for this class.</div>
        )}

        <ul className="mt-2 space-y-2">
          {students.map((s) => (
            <li key={s._id} className="border p-2 rounded flex justify-between">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-slate-500">Roll: {s.rollNo}</div>
              </div>

              {/* This is how you "populate/use" the student _id in UI */}
              <div className="text-sm"><button onClick={()=> navigate(`/dashboard/step_two/${s._id}`)}   className="relative inline-flex items-center justify-center p-3 overflow-hidden text-sm font-medium text-heading rounded-md bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue500">Report card</button></div>

              {/* Example: button to select a student id for some action */}
              {/* <button onClick={() => handleSelectStudent(s._id)}>Select</button> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
