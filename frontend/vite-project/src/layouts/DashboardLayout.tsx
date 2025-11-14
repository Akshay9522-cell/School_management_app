import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type Props = { children: React.ReactNode };

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
