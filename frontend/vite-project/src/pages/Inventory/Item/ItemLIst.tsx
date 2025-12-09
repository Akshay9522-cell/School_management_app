import React, { useEffect, useState } from "react";
import { getItems, deleteItem } from "../../../api/inventoryApi";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export interface item{
  _id?: string;
  name?: string;
  category?: { name?: string };  // not string
  vendor?: { name?: string };    // not string
  currentStock?: string;
  lowStockLimit?: string;
}
export default function ItemList() {
  const [items, setItems] = useState<item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await getItems();
      setItems(res.data || res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: any) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    toast.success("delted")
    await deleteItem(id);
    fetchItems();
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory Items</h1>
        <Link
          to="/dashboard/itemAdd"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Item
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Vendor</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Low Limit</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.category?.name || "-"}</td>
              <td className="border p-2">{item.vendor?.name || "-"}</td>
              <td className="border p-2">{item.currentStock}</td>
              <td className="border p-2">{item.lowStockLimit}</td>
              <td className="border p-2 space-x-2">
                <Link
                  to={`/dashboard/item/${item._id}`}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
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
}
