import React, { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../../../api/inventoryApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export interface Category {
  _id?: string;
  name: string;
  description: string;
}
const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm("Are you sure?")) return;

    try {
      await deleteCategory(id);
      toast.success('deleted')
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>

        <button
          onClick={() => navigate("/dashboard/categoryAdd")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border w-40">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td className="p-2 border">{cat.name}</td>
              <td className="p-2 border">{cat.description}</td>

              <td className="p-2 border">
                <button
                  onClick={() =>
                    navigate(`/dashboard/category/${cat._id}`)
                  }
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Toaster/>
    </div>
  );
};

export default CategoryList;
