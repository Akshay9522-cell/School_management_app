import { useState } from "react";
import { createTerm } from "../../api/reportCard/termApi";

const AddTerm = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTerm({ name, startDate, endDate });
      alert("Term Created Successfully!");
      setName("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error(error);
      alert("Error creating term");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Term</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow p-6 rounded-lg"
      >
        <div>
          <label className="block mb-1 font-medium">Term Name</label>
          <input
            type="text"
            placeholder="Term 1 / Mid Term / Final Exam"
            className="border p-2 w-full rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Term
        </button>
      </form>
    </div>
  );
};

export default AddTerm;
