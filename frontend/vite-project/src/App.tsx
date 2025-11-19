import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import './App.css'
// import StudentList from "./pages/students/StudentList";
// import AddStudent from "./pages/students/AddStudent";
// import EditStudent from "./pages/students/EditStudent";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import TeacherList from "./pages/Teachers/TeacherList";
import AddTeacher from "./pages/Teachers/AddTeacher";
import EditTeacher from "./pages/Teachers/EditTeacher";
import ClassList from "./pages/Classes/ClassList";
import AddClass from "./pages/Classes/AddClass";
import StudentList from "./pages/students/StudentList";
import AddStudent from "./pages/students/AddStudent";
import AttendanceList from "./pages/Attandance/AttandanceList";
import AddAttendance from "./pages/Attandance/AddAttandance";


function App() {
  return (
  
    <BrowserRouter>
  <Routes>

    {/* Public Route */}
    <Route path="/admin/login" element={<Login />} />

    {/* Protected Dashboard Routes */}
   <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />   
  <Route path="teachers" element={<TeacherList />} />
  <Route path="teachers/add" element={<AddTeacher />} />
  <Route path="teachers/edit/:id" element={<EditTeacher />} />
  <Route path="classes" element={<ClassList />} />
  <Route path="classes/add" element={<AddClass />} />
  <Route path="students" element={<StudentList/>}/>
  <Route path="students/add" element={<AddStudent/>}/>
  // edit page is remaining
  <Route path="attendance" element={<AttendanceList/>}/>
  <Route path='attendance/add' element={<AddAttendance/>}/>



    
</Route>

  </Routes>
</BrowserRouter>

  );
}

export default App;
