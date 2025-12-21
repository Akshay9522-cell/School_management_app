import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col">

        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      

        <main className="p-4 overflow-auto">
        
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;
