import React, { useState, useEffect } from "react";
import { createItem } from "../../../api/inventoryApi";
import { getCategories } from "../../../api/inventoryApi";
import { getVendors } from "../../../api/inventoryApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export interface vendor{
  _id?:string,
  name?:string
  
}
export interface cat{
    _id?:string,
  name?:string
}

export default function ItemAdd() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<cat[]>([]);
  const [vendors, setVendors] = useState<vendor[]>([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    vendor: "",
    currentStock: 0,
    lowStockLimit: 10,
    barcode: "",
    image: ""
  });

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const cat = await getCategories();
      const ven = await getVendors();
      setCategories(cat.data || cat);
      setVendors(ven.data || ven);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    console.log(form)
    try {

      const payload = {
      ...form,
      currentStock: Number(form.currentStock),
      lowStockLimit: Number(form.lowStockLimit),
      vendor: form.vendor || undefined
      };
      await createItem(payload);
      toast.success("item added")
      navigate("/dashboard/itemList");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Item Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Vendor</label>
          <select
            name="vendor"
            value={form.vendor}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Vendor (Optional)</option>
            {vendors.map((v) => (
              <option key={v._id} value={v._id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Current Stock</label>
          <input
            type="number"
            name="currentStock"
            value={form.currentStock}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            min="0"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Low Stock Limit</label>
          <input
            type="number"
            name="lowStockLimit"
            value={form.lowStockLimit}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            min="1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Barcode (Optional)</label>
          <input
            type="text"
            name="barcode"
            value={form.barcode}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Image URL (Optional)</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Save Item
        </button>
      </form>
      <Toaster/>
    </div>
  );
}
