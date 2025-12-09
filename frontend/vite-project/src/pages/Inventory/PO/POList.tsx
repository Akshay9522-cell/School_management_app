import React, { useEffect, useState } from "react";
import { getPOs, deletePO, receivePO } from "../../../api/inventoryApi";
import { useNavigate } from "react-router-dom";

interface POItem {
  item: { _id?: string; name?: string };
  quantity: number;
}
interface PO {
  _id?: string;
  vendor: { _id?: string; name?: string };
  items: POItem[];
  status: "PENDING" | "APPROVED" | "RECEIVED" | "CANCELLED";
}
export default function POList() {
  const [pos, setPOs] = useState<PO[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadPOs();
  }, []);

  const loadPOs = async () => {
    try {
      const res = await getPOs();
      console.log(res.data)
      setPOs(res.data || res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure to delete this PO?")) return;
    try {
      await deletePO(id);
      loadPOs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReceive = async (id: string) => {
    if (!window.confirm("Receive this PO and update stock?")) return;
    try {
      await receivePO(id);
      console.log(id)
      loadPOs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <button
          onClick={() => navigate("/dashboard/poAdd")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add PO
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Vendor</th>
            <th className="border px-4 py-2">Items</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pos.map((po, index) => (
            <tr key={po._id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{po.vendor?.name}</td>
              <td className="border px-4 py-2">
                {po.items.map((i) => `${i.item?.name} (${i.quantity})`).join(", ")}
              </td>
              <td className="border px-4 py-2">{po.status}</td>
              <td className="border px-4 py-2 space-x-2">
               <button 
  onClick={() => handleReceive(po._id!)}
  disabled={po.status === "RECEIVED"}
  className="btn btn-success"
>
  Receive
</button>
                <button
                  onClick={() => navigate(`/dashboard/po/${po._id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(po._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {pos.length === 0 && (
            <tr>
              <td colSpan={5} className="border px-4 py-2 text-center">
                No Purchase Orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
