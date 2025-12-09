import React, { useEffect, useState } from "react";
import { getVendors, deleteVendor } from "../../../api/inventoryApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export interface Vendor {
  _id?: string;
  name?: string;
}

export default function VendorList() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const res = await getVendors();
      setVendors(res.data || res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await deleteVendor(id);
      toast.success("vendor delete")
      loadVendors(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <button
          onClick={() => navigate("/dashboard/vendorAdd")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Vendor
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor, index) => (
            <tr key={vendor._id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{vendor.name}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => navigate(`/dashboard/vendor/${vendor._id}`)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vendor._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {vendors.length === 0 && (
            <tr>
              <td colSpan={3} className="border px-4 py-2 text-center">
                No vendors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Toaster/>
    </div>
  );
}
