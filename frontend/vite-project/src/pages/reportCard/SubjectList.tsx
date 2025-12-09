import React, { useEffect, useState } from "react";
import { getSubjectsByClass, deleteSubject } from "../../api/reportCard/termApi";
import { getClasses } from "../../api/classApi";

const SubjectList = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [classId, setClassId] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    getClasses({}).then((res) => setClasses(res.data.classes));
  }, []);

  useEffect(() => {
    if (classId) {
      getSubjectsByClass(classId).then((res) => setSubjects(res.data.subjects));
    }
  }, [classId]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this subject?")) return;

    await deleteSubject(id);
    setSubjects(subjects.filter((sub) => sub._id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Subjects List</h1>

      {/* Class Selector */}
      <select
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
        className="border px-3 py-2 rounded-md mb-4"
      >
        <option value="">-- Select Class --</option>
        {classes.map((cls) => (
          <option key={cls._id} value={cls._id}>
            {cls.name}
          </option>
        ))}
      </select>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Subject</th>
            <th className="border px-3 py-2">Max Marks</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((sub) => (
            <tr key={sub._id}>
              <td className="border px-3 py-2">{sub.name}</td>
              <td className="border px-3 py-2">{sub.maxMarks}</td>

              <td className="border px-3 py-2 text-center">
                <button
                  onClick={() => handleDelete(sub._id)}
                  className="text-red-500 font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {subjects.length === 0 && (
            <tr>
              <td className="text-center p-4" colSpan={3}>
                No subjects found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectList;
