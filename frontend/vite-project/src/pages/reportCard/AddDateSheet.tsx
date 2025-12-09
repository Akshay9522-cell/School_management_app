import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import { getAllExams, getSubjectsByClass } from "../../api/reportCard/termApi";
import { addDateSheet } from "../../api/reportCard/termApi";

const AddDateSheet = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [classId, setClassId] = useState("");
  const [examId, setExamId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    const cls = await getClasses({});
    const ex = await getAllExams();
    const subs = await getSubjectsByClass("");

    setClasses(cls.data.data);
    setExams(ex.data.data);
    setSubjects(subs.data.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await addDateSheet({
        classId,
        examId,
        subjectId,
        date,
        startTime,
        endTime,
      });

      alert("Date Sheet entry added!");

      setSubjectId("");
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      alert("Failed to add");
      console.log(error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Date Sheet</h1>

      <form className="space-y-4 bg-white shadow p-6 rounded-lg" onSubmit={handleSubmit}>

        {/* Class */}
        <div>
          <label className="block mb-1 font-semibold">Class</label>
          <select
            className="border p-2 rounded w-full"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          >
            <option value="">-- Select Class --</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className}
              </option>
            ))}
          </select>
        </div>

        {/* Exam */}
        <div>
          <label className="block mb-1 font-semibold">Exam</label>
          <select
            className="border p-2 rounded w-full"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            required
          >
            <option value="">-- Select Exam --</option>
            {exams.map((ex) => (
              <option key={ex._id} value={ex._id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block mb-1 font-semibold">Subject</label>
          <select
            className="border p-2 rounded w-full"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-semibold">Exam Date</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Time */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Start Time</label>
            <input
              type="time"
              className="border p-2 rounded w-full"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-semibold">End Time</label>
            <input
              type="time"
              className="border p-2 rounded w-full"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Add Entry
        </button>
      </form>
    </div>
  );
};

export default AddDateSheet;
