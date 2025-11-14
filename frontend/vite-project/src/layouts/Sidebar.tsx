import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaChalkboardTeacher, FaSchool, FaClipboardList } from "react-icons/fa";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r p-4 flex flex-col space-y-4">
      <h1 className="text-xl font-bold">School Admin</h1>
      <nav className="flex flex-col space-y-2">
        <Link to="/" className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200 rounded">
          <FaUsers /> Students
        </Link>
        <Link to="/teachers" className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200 rounded">
          <FaChalkboardTeacher /> Teachers
        </Link>
        <Link to="/classes" className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200 rounded">
          <FaSchool /> Classes
        </Link>
        <Link to="/attendance" className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200 rounded">
          <FaClipboardList /> Attendance
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
