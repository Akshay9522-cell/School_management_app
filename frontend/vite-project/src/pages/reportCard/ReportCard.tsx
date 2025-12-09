import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../api/api";

export default function MarksEntry() {
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");

  const [marks, setMarks] = useState<any[]>([]);

  // Fetch classes
  useEffect(() => {
    api.get("/classes/all").then(res => setClasses(res.data.classes));
  }, []);

  // Fetch exams
  useEffect(() => {
    api.get("/terms").then(async (res) => {
      const termId = res.data.data[0]?._id;
      if (termId) {
        const examsRes = await axios.get(`/api/exams/${termId}`);
        setExams(examsRes.data.data);
      }
    });
  }, []);

  // Fetch students + subjects after class selection
  useEffect(() => {
    if (!selectedClass) return;

    axios.get(`/api/students/class/${selectedClass}`).then(res => {
      setStudents(res.data.data);
    });

    axios.get(`/api/subjects/class/${selectedClass}`).then(res => {
      setSubjects(res.data.data);
    });
  }, [selectedClass]);

  const handleEnterMark = (studentId: string, subjectId: string, marksObtained: number) => {
    setMarks(prev => [
      ...prev.filter(m => !(m.studentId === studentId && m.subjectId === subjectId)),
      {
        studentId,
        classId: selectedClass,
        examId: selectedExam,
        subjectId,
        marksObtained,
        maxMarks: 100,
      },
    ]);
  };

  const handleSubmit = async () => {
    for (let m of marks) {
      await axios.post("/api/marks/add", m);
    }
    alert("Marks Saved!");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Marks Entry</h1>

      <div className="flex gap-4 mt-4">
        <select onChange={e => setSelectedClass(e.target.value)} className="border p-2">
          <option value="">Select Class</option>
          {classes.map((c: any) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select onChange={e => setSelectedExam(e.target.value)} className="border p-2">
          <option value="">Select Exam</option>
          {exams.map((e: any) => (
            <option key={e._id} value={e._id}>{e.name}</option>
          ))}
        </select>
      </div>

      {students.length > 0 && subjects.length > 0 && (
        <table className="table-auto w-full mt-6 border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Student</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Marks</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s: any) =>
              subjects.map((sub: any) => (
                <tr key={`${s._id}-${sub._id}`}>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{sub.name}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="border p-1 w-20"
                      onChange={(e) =>
                        handleEnterMark(s._id, sub._id, Number(e.target.value))
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {marks.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Marks
        </button>
      )}
    </div>
  );
}
