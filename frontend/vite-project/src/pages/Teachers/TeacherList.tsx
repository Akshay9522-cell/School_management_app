import { useEffect, useState } from "react";
import { getTeachers, updateTeacherClass, updateTeacherSubject } from "../../api/teacherApi";
import { getClasses } from "../../api/classApi";
import { useNavigate } from "react-router-dom";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  subject: string;
  phone?: string;
  isActive: boolean;
  classIds: {
    _id: string;
    name: string;
    section: string;
  }[];
}

interface ClassItem {
  _id: string;
  name: string;
  section: string;
}

const TeacherList = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<Record<string, string>>({});

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [classFilter, setClassFilter] = useState<string[]>([]); // array with one item

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadClasses();
    loadTeachers();
  }, [page, search, subjectFilter, classFilter]);

  const loadClasses = async () => {
    try {
      const res = await getClasses({});
      setClasses(res.data?.classes || []);
      
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  };

  const loadTeachers = async () => {
    try {
      const res = await getTeachers({
        page,
        limit,
        search,
        subject: subjectFilter,
        classIds: classFilter.length ? classFilter : undefined, // only send if selected
      });
      setTeachers(res.data?.data || []);
      setTotalPages(res.data?.pagination?.pages);
    } catch (err) {
      console.error("Failed to load teachers", err);
      setTeachers([]);
      setTotalPages(1);
    }
  };

  const handleClassAssign = async (teacherId: string) => {
    const selectedClassId = selectedClass[teacherId];
    if (!selectedClassId) {
      alert("Please select a class first");
      return;
    }

    const teacher = teachers.find((t) => t._id === teacherId);
    if (!teacher) return;

    const updatedClassIds = Array.from(
      new Set([...teacher.classIds.map((c) => c._id), selectedClassId])
    );

    try {
      await updateTeacherClass(teacherId, updatedClassIds);
      setSelectedClass((prev) => ({ ...prev, [teacherId]: "" }));
      loadTeachers();
    } catch (err) {
      console.error(err);
      alert("Failed to assign class");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">Teacher List</h2>

      <button
        onClick={() => navigate("/dashboard/teachers/add")}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-lg shadow-md hover:scale-105 transition mb-6"
      >
        + Add Teacher
      </button>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search teacher..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border rounded-lg p-2 shadow-sm"
        />

        <select
          value={subjectFilter}
          onChange={(e) => {
            setPage(1);
            setSubjectFilter(e.target.value);
          }}
          className="border rounded-lg p-2 shadow-sm"
        >
          <option value="">All Subjects</option>
          <option value="Math">Math</option>
          <option value="Science">Science</option>
          <option value="English">English</option>
          <option value="Computer">Computer</option>
          <option value="History">History</option>
          <option value="Biology">Biology</option>
          <option value="Geography">Geography</option>
          <option value="Social Science">Social Science</option>
        </select>

        <select
          value={classFilter[0] || ""}
          onChange={(e) => {
            setPage(1);
            setClassFilter(e.target.value ? [e.target.value] : []);
            console.log(classes)
          }}
          className="border rounded-lg p-2 shadow-sm"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} {c.section}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Classes Assigned</th>
              <th className="p-3 text-left">Active</th>
            </tr>
          </thead>

          <tbody>
            {teachers.map((t) => (
              <tr key={t._id} className="border-b hover:bg-indigo-50 transition">
                <td className="p-3">{t.name}</td>
                <td className="p-3">{t.email}</td>
                <td className="p-3">{t.subject || "Not Assigned"}</td>

                {/* Classes */}
                <td className="p-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      {t.classIds.length === 0 ? (
                        <span className="text-gray-500">No classes</span>
                      ) : (
                        t.classIds.map((c) => (
                          <span key={c._id} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm">
                            {c.name} {c.section}
                            
                          </span>
                        ))
                      )}
                    </div>

                    {/* Assign new class */}
                    <div className="flex items-center gap-2 mt-2">
                      <select
                        value={selectedClass[t._id] || ""}
                        onChange={(e) =>
                          setSelectedClass((prev) => ({ ...prev, [t._id]: e.target.value }))
                        }
                        className="border p-1 rounded"
                      >
                        <option value="">Assign new class</option>
                        {classes.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name} {c.section}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleClassAssign(t._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600 transition"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="p-3">
                  <div
                    className="w-4 h-4 rounded-full shadow"
                    style={{ backgroundColor: t.isActive ? "green" : "red" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-40 shadow hover:bg-indigo-600 transition"
        >
          Prev
        </button>

        <span className="text-lg font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-40 shadow hover:bg-indigo-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TeacherList;
