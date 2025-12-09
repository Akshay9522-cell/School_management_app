import React, { useEffect, useState } from "react";
import { getIssues, deleteIssue } from "../../../api/inventoryApi";
import { useNavigate } from "react-router-dom";

interface Issue {
  _id?: string;
  item: { _id?: string; name?: string };
  quantity: number;
  issuedTo: string;
  issuedAt?: string;
  remarks?: string;
}

export default function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const navigate=useNavigate()
  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const res = await getIssues();
      setIssues(res.data || res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this issue and restore stock?")) return;

    try {
      await deleteIssue(id);
      loadIssues();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={()=> navigate("/dashboard/issueAdd")}>add Issue</button>
      <h1 className="text-2xl font-bold mb-4">Issued Items</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Item</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Issued To</th>
            <th className="border px-4 py-2">Issued At</th>
            <th className="border px-4 py-2">Remarks</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, index) => (
            <tr key={issue._id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{issue.item?.name}</td>
              <td className="border px-4 py-2">{issue.quantity}</td>
              <td className="border px-4 py-2">{issue.issuedTo}</td>
              <td className="border px-4 py-2">{new Date(issue.issuedAt || "").toLocaleString()}</td>
              <td className="border px-4 py-2">{issue.remarks || "-"}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleDelete(issue._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {issues.length === 0 && (
            <tr>
              <td colSpan={7} className="border px-4 py-2 text-center">
                No issued items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
