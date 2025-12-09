import React, { useState, useEffect } from "react";
import { getItems, issueItem } from "../../../api/inventoryApi";
import { useNavigate } from "react-router-dom";

interface Item {
  _id?: string;
  name?: string;
  currentStock?: number;
}

export default function IssueAdd() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);

  const [form, setForm] = useState({
    item: "",
    quantity: 0,
    issuedTo: "",
    remarks: "",
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await getItems();
      setItems(res.data || res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await issueItem({
        ...form,
        quantity: Number(form.quantity),
      });
      navigate("/dashboard/issueList");
    } catch (error) {
      console.error(error);
      alert("Error issuing item. Check stock or input.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Issue Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Item</label>
          <select
            name="item"
            value={form.item}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name} (Stock: {i.currentStock})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min={1}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Issued To</label>
          <input
            type="text"
            name="issuedTo"
            value={form.issuedTo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Remarks (Optional)</label>
          <input
            type="text"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Issue Item
        </button>
      </form>
    </div>
  );
}
