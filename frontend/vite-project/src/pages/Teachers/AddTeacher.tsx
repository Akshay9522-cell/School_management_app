import React, { useState, useEffect } from "react";
import { getTeachers, updateTeacherSubject } from "../../api/teacherApi";
import { useNavigate } from "react-router-dom";



const AssignSubject = () => {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    loadTeachers();
  }, []);
  type Teacher = {
  name: string;
  email: string;
  _id:string
  // other fields
};




  const loadTeachers = async () => {
    const res = await getTeachers({all:"true"} as any);
    const teachers: Teacher[] = res.data.data;
    setTeachers(res.data.data);
    console.log(res.data.data)
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (!selectedTeacher || !subject) {
      alert("Please select teacher and subject");
      return;
    }

    try {
      await updateTeacherSubject(selectedTeacher, subject);
      alert("Subject assigned successfully!");
      loadTeachers()
      navigate("/dashboard/teachers");
    } catch (err) {
      console.log(err);
      alert("Failed to assign subject");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Assign Subject to Teacher</h2>

      <form className="bg-white p-6 rounded-xl shadow-md space-y-5" onSubmit={handleSubmit}>

        {/* Teacher Dropdown */}
        <div>
          <label className="font-semibold">Select Teacher</label>
          <select
            className="w-full mt-1 p-3 border rounded-lg"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t._id } value={t._id}>
                {t.name } — {t.email}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Dropdown */}
        <div>
          <label className="font-semibold">Select Subject</label>
          <select
            className="w-full mt-1 p-3 border rounded-lg"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="">Select Subject</option>
           <option value="Mathematics">Mathematics</option>
<option value="Science">Science</option>
<option value="Physics">Physics</option>
<option value="Chemistry">Chemistry</option>
<option value="Biology">Biology</option>

<option value="English">English</option>
<option value="Hindi">Hindi</option>
<option value="Sanskrit">Sanskrit</option>

<option value="Social Science">Social Science</option>
<option value="History">History</option>
<option value="Geography">Geography</option>
<option value="Civics">Civics</option>
<option value="Economics">Economics</option>

<option value="Computer Science">Computer Science</option>
<option value="Information Technology">Information Technology</option>

<option value="Environmental Science">Environmental Science</option>
<option value="Moral Science">Moral Science</option>

<option value="Physical Education">Physical Education</option>
<option value="General Knowledge">General Knowledge</option>

<option value="Art">Art</option>
<option value="Music">Music</option>
<option value="Dance">Dance</option>

<option value="Commerce">Commerce</option>
<option value="Accountancy">Accountancy</option>
<option value="Business Studies">Business Studies</option>

<option value="Home Science">Home Science</option>
<option value="Psychology">Psychology</option>
<option value="Political Science">Political Science</option>

          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Assign
        </button>
      </form>
    </div>
  );
};

export default AssignSubject;
