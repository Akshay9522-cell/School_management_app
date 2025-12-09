import React, { useEffect, useState } from "react";
import { getIssues, createReturn } from "../../../api/inventoryApi";
import { useNavigate } from "react-router-dom";

interface IssueItem {
  _id: string;
  item: { _id: string; name: string };
  quantity: number;
}

interface Issue {
  _id: string;
  items: IssueItem[];
  issuedTo: string;
  issuedAt: string;
}

interface ReturnForm {
  issue: string;
  item: string;
  quantity: number;
  returnedBy: string;
  condition: "GOOD" | "DAMAGED" | "REPAIR";
  remarks?: string;
}

export default function AddReturn() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [form, setForm] = useState<ReturnForm>({
    issue: "",
    item: "",
    quantity: 1,
    returnedBy: "",
    condition: "GOOD",
    remarks: "",
  });

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const res = await getIssues();
      setIssues(res.data || res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIssueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const issueId = e.target.value;
    console.log(issueId)
    setForm({ ...form, issue: issueId, item: "" });
    const issue = issues.find((i) => i._id === issueId) || null;
    setSelectedIssue(issue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "quantity" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   console.log(form)
    try {
      await createReturn(form);
      navigate("/dashboard/returnList");
    } catch (err) {
      console.error(err);
      alert("Error submitting return. Check console for details.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Return</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Issue Selection */}
        <div>
          <label className="block mb-1 font-medium">Select Issue</label>
          <select
            name="issue"
            value={form.issue}
            onChange={handleIssueChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Issue</option>
            {issues.map((i) => (
              <option key={i._id} value={i._id}>
                {i.issuedTo} - {new Date(i.issuedAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Item Selection */}
        {selectedIssue && selectedIssue.items && (
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
              {selectedIssue.items.map((i) => (
                <option key={i._id} value={i.item._id}>
                  {i.item.name} (Qty issued: {i.quantity})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            min={1}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Returned By */}
        <div>
          <label className="block mb-1 font-medium">Returned By</label>
          <input
            type="text"
            name="returnedBy"
            value={form.returnedBy}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block mb-1 font-medium">Condition</label>
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="GOOD">GOOD</option>
            <option value="DAMAGED">DAMAGED</option>
            <option value="REPAIR">REPAIR</option>
          </select>
        </div>

        {/* Remarks */}
        <div>
          <label className="block mb-1 font-medium">Remarks (Optional)</label>
          <textarea
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
          Save Return
        </button>
      </form>
    </div>
  );
}
