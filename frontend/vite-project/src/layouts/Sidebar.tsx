import { NavLink } from "react-router-dom";
import { FaUsers, FaChalkboardTeacher, FaSchool, FaClipboardList, FaHome } from "react-icons/fa";

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`bg-white border-r h-full p-4 flex flex-col space-y-4 transition-all duration-300
        ${isOpen ? "w-64" : "w-0 overflow-hidden"}
      `}
    >
      <h1 className="text-xl font-bold">School Admin</h1>

      <nav className="flex flex-col space-y-1">

          <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded 
             ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
          }
        >
          <FaHome /> Home
        </NavLink>
        <NavLink
          to="/dashboard/students"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded 
             ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
          }
        >
          <FaUsers /> Students
        </NavLink>

        <NavLink
          to="/dashboard/teachers"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded 
             ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
          }
        >
          <FaChalkboardTeacher /> Teachers
        </NavLink>

        <NavLink
          to="/dashboard/classes"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded 
             ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
          }
        >
          <FaSchool /> Classes
        </NavLink>

        <NavLink
          to="/dashboard/attendance"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded 
             ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
          }
        >
          <FaClipboardList /> Attendance
        </NavLink>

      </nav>
    </div>
  );
};

export default Sidebar;
