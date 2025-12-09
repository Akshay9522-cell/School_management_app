import React, { useEffect, useState } from "react";
import { getReturns, deleteReturn } from "../../../api/inventoryApi";
import { useNavigate } from "react-router-dom";

interface ReturnItem {
  _id?: string;
  issue: { _id?: string; item: { name?: string }; quantity: number };
  item: { _id?: string; name?: string };
  quantity: number;
  returnedBy: string;
  returnedAt?: string;
  condition: string;
  remarks?: string;
}

export default function ReturnList() {
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const navigate=useNavigate()
  useEffect(() => {
    loadReturns();
  }, []);

  const loadReturns = async () => {
    try {
      const res = await getReturns();
      setReturns(res.data || res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this return and update stock?")) return;

    try {
      await deleteReturn(id);
      loadReturns();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={()=> navigate('/dashboard/returnAdd')}>add return</button>
      <h1 className="text-2xl font-bold mb-4">Returned Items</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Item</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Returned By</th>
            <th className="border px-4 py-2">Returned At</th>
            <th className="border px-4 py-2">Condition</th>
            <th className="border px-4 py-2">Remarks</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((r, index) => (
            <tr key={r._id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{r.item?.name}</td>
              <td className="border px-4 py-2">{r.quantity}</td>
              <td className="border px-4 py-2">{r.returnedBy}</td>
              <td className="border px-4 py-2">{new Date(r.returnedAt || "").toLocaleString()}</td>
              <td className="border px-4 py-2">{r.condition}</td>
              <td className="border px-4 py-2">{r.remarks || "-"}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(r._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {returns.length === 0 && (
            <tr>
              <td colSpan={8} className="border px-4 py-2 text-center">
                No returns found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
