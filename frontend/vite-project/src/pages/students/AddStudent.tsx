  import { useEffect, useState } from "react";
  import { addStudent } from "../../api/studentApi";
  import { getClasses } from "../../api/classApi";
  import { useNavigate } from "react-router-dom";

  const AddStudent = () => {
    const navigate = useNavigate();

    const [myclass,setMyclass] = useState([]);
    const [student, setStudent] = useState({
      name: "",
      email: "",
      phone: "",
      address: "",
      parentName: "",
      parentPhone: "",
      admissionNo: "",
      dob: "",
      gender: "",
      classId: ""
    });

    useEffect(() => {
      loadClasses();
    }, []);

    const loadClasses = async () => {
      const res = await getClasses({ page: 1, limit: 1000 });
      setMyclass(res.data.classes);
      console.log(myclass);
      
    };
    useEffect(() => {
  console.log(myclass); // This will log when myclass changes
}, [myclass]);


    const handleChange = (e: any) => {
      setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
      e.preventDefault();
      console.log(student)

      try {
        await addStudent(student);
        alert("Student added successfully!");
        navigate("/dashboard/students");
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to add student");
      }
    };

    return (
      <div className="p-5">
        <h2 className="text-xl font-bold mb-4">Add Student</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <input name="name" placeholder="Name" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input name="phone" placeholder="Phone" onChange={handleChange} required />
          <input name="address" placeholder="Address" onChange={handleChange} required />

          <input name="parentName" placeholder="Parent Name" onChange={handleChange} required />
          <input name="parentPhone" placeholder="Parent Phone" onChange={handleChange} required />

          <input name="admissionNo" placeholder="Admission No" onChange={handleChange} required />

          <input type="date" name="dob" onChange={handleChange} required />

          <select name="gender" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
<select
  name="classId"
  onChange={handleChange}
  required
  className="border p-2 rounded  h-10"
>
  <option value="">Select Class</option>
  {myclass.length > 0 ? (
    myclass.map((cls: any, index: number) => (
      <option
        key={cls._id + index} // ensures uniqueness in case of duplicate _id
        value={cls._id}
      >
        {cls.name?.trim() ? cls.name : "(No Name)"}{" "}
        {cls.section?.trim() ? `- ${cls.section}` : ""}
      </option>
    ))
  ) : (
    <option value="" disabled>
      No classes available
    </option>
  )}
</select>


        {/* <select name="classId" onChange={handleChange} required>
    <option value="">Select Class</option>
    {myclass.length > 0 ? (
      myclass.map((cls: any) => (
        <option key={cls._id} value={cls._id}>
          {cls.name || "(No Name)"} {cls.section ? `- ${cls.section}` : ""}
        </option>
      ))
    ) : (
      <option value="" disabled>No classes available</option>
    )}
  </select> */}


          <button type="submit" className="bg-blue-600 text-white p-2 rounded col-span-2">
            Add Student
          </button>
        </form>
      </div>
    );
  };

  export default AddStudent;
 

