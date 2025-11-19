import React, { useEffect, useState } from "react";
import { getClasses, deleteClass } from "../../api/classApi";
import { useNavigate } from "react-router-dom";

const ClassList: React.FC = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);     // ⭐ Pagination
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      setLoading(true);

      const res = await getClasses({ page, limit });

      setClasses(res.data.classes || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
      alert("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      await deleteClass(id);
      alert("Class deleted!");
      fetchClasses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete class");
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Class List</h2>
        <button
          onClick={() => navigate("/dashboard/classes/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Class
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Class Name</th>
                <th className="p-2 border">Section</th>
                <th className="p-2 border">Class Teacher</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {classes.map((item: any) => (
                <tr key={item._id}>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.section}</td>
                  <td className="p-2 border">
                    {item.classTeacher?.name || "N/A"}
                  </td>

                  <td className="p-2 border">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/classes/edit/${item._id}`)
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {classes.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No classes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Section */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={index}
                  onClick={() => setPage(pageNum)}
                  className={`px-4 py-2 border rounded ${
                    page === pageNum
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassList;
