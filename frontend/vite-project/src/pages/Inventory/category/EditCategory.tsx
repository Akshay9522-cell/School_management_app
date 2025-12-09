import React, { useEffect, useState } from "react";

import { getCategory, updateCategory } from "../../../api/inventoryApi";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
export interface Category {
  _id?: string;
  name: string;
  description: string;
}
const EditCategory: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<Category>({
    name: "",
    description: "",
  });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const res = await getCategory(id);
      setForm(res.data);
    };

    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    await updateCategory(id, form);
    toast.success('Update successfully')
    navigate("/inventory/categories");
  };

  return (
    <div className="p-4 w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Edit Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="border p-2 w-full"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
      <Toaster/>
    </div>
  );
};

export default EditCategory;
