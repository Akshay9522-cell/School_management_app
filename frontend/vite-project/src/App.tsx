import { Routes, Route, BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";

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
import GenerateQRCodePage from "./pages/GenerateQRCodePage";
import QRScannerPage from "./pages/QRScannerPage";
import PendingTeachers from "./pages/Teachers/PendingTeachers";
import AddTeacherPage from "./pages/Teachers/AddTeacherPage";
import TeacherAttendancePage from "./pages/Teachers/TeacherAttendancePage";
import StudentDailyAttendance from "./pages/students/StudentDailyAttendance";
import AttendanceSummaryPage from "./pages/students/AttendanceSummaryPage";
import BusTracking from "./pages/busTracking/BusTracking";
import BusTrackingWrapper from "./pages/busTracking/BusTrackingWrapper";
import StudentAssignToBus from "./pages/students/StudentAssignToBus";
import StudentDataByBus from "./pages/students/StudentDataByBus";
import BusList from "./pages/Buses/BusList";
import RouteList from "./pages/Route/RouteList";
import StopList from "./pages/Stop/StopList";

import StepOne from "./pages/ReportCard/StepOne";
import ReportCard from "./pages/ReportCard/ReportCard";
import CreateHomework from "./pages/homeWork/CreateHomework";
import ClassHomeworkList from "./pages/homeWork/ClassHomeworkList";
import StudentDailyReports from "./pages/students/StudentDailyReport";
import InventoryPage from "./pages/inventory/InventoryPage";






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
    {/* Home inside dashboard layout */}
      <Route index element={<Dashboard />} /> 

       {/* Other menu pages */}
  <Route path="bustracking/:busId" element={<BusTrackingWrapper />} />
  <Route path="teachers" element={<TeacherList />} />
  <Route path="teachers/add" element={<AddTeacher />} />
  <Route path="teachers/edit/:id" element={<EditTeacher />} />
  <Route path="pending-teachers" element={<PendingTeachers />} />
  <Route path="add-teacher" element={<AddTeacherPage/>}/>
  <Route path="teacher-attendance" element={<TeacherAttendancePage/>}/>
  <Route path ="inventory"  element ={<InventoryPage/>}/>
  <Route path="classes" element={<ClassList />} />
  <Route path="classes/add" element={<AddClass />} />
  <Route path="students" element={<StudentList/>}/>
  <Route path="students/add" element={<AddStudent/>}/>
  <Route path="student-daily-attendance" element={<StudentDailyAttendance/>}/>
  <Route path="student-attendance-sheet" element={<AttendanceSummaryPage/>}/>
  <Route path="bus-assign" element={<StudentAssignToBus/>}/>
  <Route path='get-student-by-bus-route' element={<StudentDataByBus/>}/>
  <Route path="create-bus" element={<BusList/>}/>
  <Route path="create-route" element={<RouteList/>}/>
  <Route path="create-stop" element={<StopList/>}/>
  // edit page is remaining
 
  <Route path="qrcode-scanner" element={<QRScannerPage/>}/>
 
  <Route path="qrcodepage" element={<GenerateQRCodePage/>}/>
  
 

  <Route path="report-card" element={<StepOne/>}/>
  <Route path="step_two/:id"  element={<ReportCard/>}/>

  <Route path="create-hw" element={<CreateHomework/>}/>
 
  <Route path="class-hw" element={<ClassHomeworkList/>}/>

  <Route path="sdr" element={<StudentDailyReports/>}/>
  




  



  {/*<Route path="reports" element={<Reports/>}/>

  <Route path="returnList" element={<ReturnList/>}/>
  <Route path="addReturn" element={<AddReturn/>}/>
  <Route path ="addStock" element={<AddStock/>}/> */}




    
</Route>

  </Routes>
</BrowserRouter>

  );
}

export default App;
