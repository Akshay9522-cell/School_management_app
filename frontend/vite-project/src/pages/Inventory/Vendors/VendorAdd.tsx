import React, { useState } from "react";
import { createVendor } from "../../../api/inventoryApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function VendorAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name.trim()) return;
      await createVendor({ name });
      toast.success(' Vendor added')
      navigate("/dashboard/vendorList");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Vendor</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Vendor Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Save Vendor
        </button>
      </form>
      <Toaster/>
    </div>
  );
}