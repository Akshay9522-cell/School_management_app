import React, { useEffect, useState } from "react";
import { createSubject } from "../../api/reportCard/termApi";
import { getClasses } from "../../api/classApi";

const AddSubject = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [classId, setClassId] = useState("");
  const [name, setName] = useState("");
  const [maxMarks, setMaxMarks] = useState(100);

  useEffect(() => {
     getClasses({}).then((res) => {
      setClasses(res.data.classes);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!classId || !name) {
      alert("Please enter all fields");
      return;
    }

    await createSubject({ classId, name, maxMarks });
    alert("Subject Added!");
    setName("");
    setMaxMarks(100);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Add Subject</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Class Dropdown */}
        <div>
          <label className="block mb-1">Select Class</label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="border px-3 py-2 w-full rounded-md"
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Name */}
        <div>
          <label className="block mb-1">Subject Name</label>
          <input
            type="text"
            placeholder="Enter subject"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 w-full rounded-md"
          />
        </div>

        {/* Max Marks */}
        <div>
          <label className="block mb-1">Max Marks</label>
          <input
            type="number"
            value={maxMarks}
            onChange={(e) => setMaxMarks(Number(e.target.value))}
            className="border px-3 py-2 w-full rounded-md"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Subject
        </button>
      </form>
    </div>
  );
};

export default AddSubject;
