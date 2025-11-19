import { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "../../api/studentApi";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  rollNo: number;
  admissionNo: string;
  gender: string;
  status: string;
  classId?: {
    name: string;
    section: string;
  };
}

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const query =`?page=${page}&search=${search}`;
      const res = await getStudents(query);

      setStudents(res.data.data);
    
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching students", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  // Search functionality
  const handleSearch = () => {
    setPage(1);
    fetchStudents();
  };

  // Delete student
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (error) {
      console.error("Failed to delete student", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Students List</h1>

      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          placeholder="Search name, email, roll no..."
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Search
        </button>

        <button
          onClick={() => navigate("/dashboard/students/add")}
          className="bg-green-600 text-white px-4 rounded"
        >
          + Add Student
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Roll No</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Class</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((stu) => (
                <tr key={stu._id} className="border">
                  <td className="p-2 border">{stu.rollNo}</td>
                  <td className="p-2 border">{stu.name}</td>
                  <td className="p-2 border">
                    {stu.classId
                      ? `${stu.classId.name} - ${stu.classId.section}`
                      : "N/A"}
                  </td>
                  <td className="p-2 border">{stu.email}</td>
                  <td className="p-2 border">{stu.phone}</td>

                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        stu.status === "Active"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {stu.status}
                    </span>
                  </td>

                  <td className="p-2 border flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => navigate(`/students/edit/${stu._id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(stu._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="bg-gray-700 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-700 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentList;
