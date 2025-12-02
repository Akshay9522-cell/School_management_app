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


import ItemsPage from "./pages/Inventory/ItemPage";
import StockPage from "./pages/Inventory/StockPage";
import PaymentPage from "./pages/Inventory/PaymentPage";
import GenerateQRCodePage from "./pages/GenerateQRCodePage";
import QRScannerPage from "./pages/QRScannerPage";
import PendingTeachers from "./pages/Teachers/PendingTeachers";
import AddTeacherPage from "./pages/Teachers/AddTeacherPage";
import TeacherAttendancePage from "./pages/Teachers/TeacherAttendancePage";
import StudentDailyAttendance from "./pages/students/StudentDailyAttendance";
import AttendanceSummaryPage from "./pages/students/AttendanceSummaryPage";


function App() {
  return (
  
    <BrowserRouter>
  <Routes>

    {/* Public Route */}
    <Route path="/admin/login" element={<Login />} />
 <Route index element={<Login />} />   
    {/* Protected Dashboard Routes */}
   <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
 
  <Route path="teachers" element={<TeacherList />} />
  <Route path="teachers/add" element={<AddTeacher />} />
  <Route path="teachers/edit/:id" element={<EditTeacher />} />
  <Route path="pending-teachers" element={<PendingTeachers />} />
  <Route path="add-teacher" element={<AddTeacherPage/>}/>
  <Route path="teacher-attendance" element={<TeacherAttendancePage/>}/>

  <Route path="classes" element={<ClassList />} />
  <Route path="classes/add" element={<AddClass />} />
  <Route path="students" element={<StudentList/>}/>
  <Route path="students/add" element={<AddStudent/>}/>
  <Route path="student-daily-attendance" element={<StudentDailyAttendance/>}/>
  <Route path="student-attendance-sheet" element={<AttendanceSummaryPage/>}/>
  // edit page is remaining
 
  <Route path="qrcode-scanner" element={<QRScannerPage/>}/>
  <Route path="item" element={<ItemsPage/>}/>
  <Route path="stock" element={<StockPage/>}/>
  <Route path="payment" element={<PaymentPage/>}/>
  <Route path="qrcodepage" element={<GenerateQRCodePage/>}/>
  





    
</Route>

  </Routes>
</BrowserRouter>

  );
}

export default App;
