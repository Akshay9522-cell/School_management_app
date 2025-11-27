import { NavLink } from "react-router-dom";
import { FaUsers, FaChalkboardTeacher, FaSchool, FaClipboardList, FaHome } from "react-icons/fa";
import { MdInventory2, MdExpandLess, MdExpandMore } from "react-icons/md";
import { useState } from "react";
import Cookies from "js-cookie";

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const [openInventory, setOpenInventory] = useState(false);

  // Read role from cookie (admin / teacher)
  const role = Cookies.get("role");

  return (
    <div
      className={`bg-white border-r h-full flex flex-col space-y-4 transition-all duration-300
        ${isOpen ? "w-54" : "w-0 overflow-hidden"}
      `}
    >
      <h1 className="text-xl font-bold">School Dashboard</h1>

      <nav className="flex flex-col space-y-1">

        {/* HOME — Visible to both */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded 
             ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
          }
        >
          <FaHome /> Home
        </NavLink>

        {/* ------------------------ 
            ADMIN ONLY SECTION
        ------------------------ */}
        {role === "admin" && (
          <>
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
              to="/dashboard/qrcodepage"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded 
                 ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
              }
            >
              <FaUsers /> QR Generator
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

            {/* Inventory Dropdown — ADMIN ONLY */}
            <button
              onClick={() => setOpenInventory(!openInventory)}
              className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-200"
            >
              <div className="flex items-center gap-2">
                <MdInventory2 /> Inventory
              </div>
              {openInventory ? <MdExpandLess /> : <MdExpandMore />}
            </button>

            {openInventory && (
              <div className="ml-8 flex flex-col space-y-1">
                <NavLink
                  to="/dashboard/item"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded 
                     ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
                  }
                >
                  Items
                </NavLink>

                <NavLink
                  to="/dashboard/stock"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded 
                     ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
                  }
                >
                  Stock
                </NavLink>

                <NavLink
                  to="/dashboard/payment"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded 
                     ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
                  }
                >
                  Payment
                </NavLink>
              </div>
            )}
          </>
        )}

        {/* ------------------------ 
            TEACHER ONLY SECTION
        ------------------------ */}
        {role === "teacher" && (
          <>
            <NavLink
              to="/dashboard/qrcode-scanner"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded 
                 ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
              }
            >
              <FaUsers /> Scan QR
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
          </>
        )}

      </nav>
    </div>
  );
};

export default Sidebar;
