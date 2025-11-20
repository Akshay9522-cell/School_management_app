import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import { getStudentsByClass } from "../../api/studentApi";

export default function ClassStudentFilterPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Load all classes for dropdown
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const res = await getClasses({ limit: 1000 }); // IMPORTANT FIX
    setClasses(res.data.classes || []);
    
  };

  // Load students when class or search changes
  useEffect(() => {
    if (!selectedClass) return;

    const delay = setTimeout(() => {
      loadStudents();
    }, 300);

    return () => clearTimeout(delay);
  }, [selectedClass, search]);
  console.log(selectedClass)

  const loadStudents = async () => {
    setLoading(true);
    const res = await getStudentsByClass(selectedClass, { search });
    setStudents(res.data.data);
    setLoading(false);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">
        Class Wise Student List
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {/* Class Dropdown */}
        <select
          className="px-4 py-2 border rounded-lg bg-white shadow-sm"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            
            <option key={cls._id} value={cls._id}>
              {cls.name}-{cls.section}
          
            </option>
           
          ))}
          
        </select>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search students..."
          className="px-4 py-2 border rounded-lg shadow-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="w-full border bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Roll</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Parent</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="border p-2">{s.rollNo}</td>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.phone}</td>
                <td className="border p-2">{s.parentName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
