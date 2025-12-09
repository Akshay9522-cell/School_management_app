import React, { useState, useEffect } from "react";
import { getVendor, updateVendor } from "../../../api/inventoryApi";
import { useNavigate, useParams } from "react-router-dom";

export default function VendorEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");

  useEffect(() => {
    loadVendor();
  }, []);

  const loadVendor = async () => {
    if (!id) return;
    try {
      const res = await getVendor(id);
      setName(res.data.name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateVendor(id, { name });
      navigate("/dashboard/vendorList");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Vendor</h1>

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
          Update Vendor
        </button>
      </form>
    </div>
  );
}