import { useEffect, useState } from "react";
import { createExam } from "../../api/reportCard/termApi";
import { getTerms } from "../../api/reportCard/termApi";

const AddExam = () => {
  const [terms, setTerms] = useState<any[]>([]);
  const [termId, setTermId] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    const res = await getTerms();
    setTerms(res.data.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createExam({
        termId,
        name,
        startDate,
        endDate,
      });

      alert("Exam Created Successfully!");

      setName("");
      setStartDate("");
      setEndDate("");
      setTermId("");
    } catch (error) {
      console.log(error);
      alert("Error creating exam");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Exam</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow p-6 rounded-lg"
      >
        <div>
          <label className="block mb-1 font-semibold">Select Term</label>
          <select
            className="border p-2 rounded w-full"
            value={termId}
            onChange={(e) => setTermId(e.target.value)}
            required
          >
            <option value="">-- Select Term --</option>
            {terms.map((term) => (
              <option key={term._id} value={term._id}>
                {term.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Exam Name</label>
          <input
            type="text"
            placeholder="Mid Term / Unit Test / Final Exam"
            className="border p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Start Date</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">End Date</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Exam
        </button>
      </form>
    </div>
  );
};

export default AddExam;
