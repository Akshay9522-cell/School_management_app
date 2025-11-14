
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
//import Students from './pages/Student';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {


  return (
    <>
 
      <Router>
      <Routes>

        {/* Default route → redirect to login */}
        <Route index element={<Login/>} />

        {/* Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* <Route 
          path="/students" 
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          } 
        /> */}

      </Routes>
    </Router>
    </>
  )
}

export default App
