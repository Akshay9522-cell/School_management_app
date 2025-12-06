import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaClipboardList,
  FaHome,
  FaFileDownload,
  FaBus,
} from "react-icons/fa";
import { MdInventory2, MdExpandLess, MdExpandMore } from "react-icons/md";
import { SiGooglesheets } from "react-icons/si";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

interface Bus {
  _id: string;
}

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const [openInventory, setOpenInventory] = useState(false);
  const [openTeacher, setOpenTeacher] = useState(false);
  const [openTransport, setOpenTransport] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/buses/get").then((res) => {
      setBuses(res.data.buses);
    });
  }, []);

  const role = Cookies.get("role");

  const baseLink =
    "group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-slate-300 hover:text-white hover:bg-white/10";

  const activeLink =
    "bg-white/15 text-white shadow-sm shadow-sky-500/40";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-550 to-slate-600 text-white">
    <aside
      className={`
        relative z-20 h-screen
        ${isOpen ? "w-64" : "w-0"}
        transition-[width] duration-300
        bg-slate-950/80 border-r border-white/10
        backdrop-blur-xl
        flex flex-col
      `}
    >
      {/* Glow border */}
      <div className="pointer-events-none absolute inset-0 rounded-r-3xl border border-white/10 shadow-[0_0_35px_rgba(59,130,246,0.45)]" />

      {/* Header */}
      <div className="relative flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/10">
        <div className="static flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow-lg shadow-sky-500/40 text-white font-black text-lg">
          SD
        </div>
        {isOpen && (
          <div>
            <h1 className="text-base font-semibold text-white tracking-wide">
              School Dashboard
            </h1>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Classic Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Scrollable nav */}
      <nav className="relative flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {/* Section title */}
        {isOpen && (
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Main
          </p>
        )}

        {/* Home */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : ""}`
          }
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-400/10 text-sky-300 group-hover:text-sky-200">
            <FaHome />
          </span>
          {isOpen && <span>Home</span>}
        </NavLink>

        {/* ADMIN SECTION */}
        {role === "admin" && (
          <>
            {isOpen && (
              <p className="mt-3 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Administration
              </p>
            )}

            {/* Students */}
            <NavLink
              to="/dashboard/students"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 to-emerald-400/10 text-emerald-300 group-hover:text-emerald-200">
                <FaUsers />
              </span>
              {isOpen && <span>Students</span>}
            </NavLink>

            {/* QR Generator */}
            <NavLink
              to="/dashboard/qrcodepage"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/25 to-fuchsia-500/10 text-violet-300 group-hover:text-violet-200">
                <FaUsers />
              </span>
              {isOpen && <span>QR Generator</span>}
            </NavLink>

            {/* Transport Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setOpenTransport((p) => !p)}
                className={`
                  ${baseLink} w-full justify-between
                  ${openTransport ? "bg-white/10" : ""}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/25 to-orange-400/10 text-amber-300 group-hover:text-amber-200">
                    <FaBus />
                  </span>
                  {isOpen && <span>Transport Management</span>}
                </div>
                {isOpen && (
                  <span className="text-slate-400">
                    {openTransport ? <MdExpandLess /> : <MdExpandMore />}
                  </span>
                )}
              </button>

              <div
                className={`
                  overflow-hidden transition-all duration-200 origin-top
                  ${openTransport ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                `}
              >
                <div className="ml-4 border-l border-white/10 pl-3 mt-1 space-y-1">
                  {[
                    { to: "/dashboard/create-bus", label: "# Add Bus" },
                    { to: "/dashboard/create-route", label: "# Add Route" },
                    { to: "/dashboard/create-stop", label: "# Create Stop" },
                    { to: "/dashboard/bus-assign", label: "# Assign Bus" },
                    {
                      to: "/dashboard/get-student-by-bus-route",
                      label: "# Student Transport Info",
                    },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center text-[13px] px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 ${
                          isActive ? "bg-white/15 text-white" : ""
                        }`
                      }
                    >
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}

                  {/* Dynamic buses */}
                  {buses.map((bus) => (
                    <NavLink
                      key={bus._id}
                      to={`/dashboard/bustracking/${bus._id}`}
                      className={({ isActive }) =>
                        `flex items-center text-[13px] px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 ${
                          isActive ? "bg-white/15 text-white" : ""
                        }`
                      }
                    >
                      <span className="mr-2 text-xs">🚍</span>
                      <span>Bus Tracking</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* Teacher Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setOpenTeacher((p) => !p)}
                className={`
                  ${baseLink} w-full justify-between
                  ${openTeacher ? "bg-white/10" : ""}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/25 to-sky-500/10 text-indigo-300 group-hover:text-indigo-200">
                    <FaChalkboardTeacher />
                  </span>
                  {isOpen && <span>Teachers</span>}
                </div>
                {isOpen && (
                  <span className="text-slate-400">
                    {openTeacher ? <MdExpandLess /> : <MdExpandMore />}
                  </span>
                )}
              </button>

              <div
                className={`
                  overflow-hidden transition-all duration-200 origin-top
                  ${openTeacher ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}
                `}
              >
                <div className="ml-4 border-l border-white/10 pl-3 mt-1 space-y-1">
                  {[
                    { to: "/dashboard/teachers", label: "All Teachers" },
                    {
                      to: "/dashboard/pending-teachers",
                      label: "Pending Teachers",
                    },
                    { to: "/dashboard/add-teacher", label: "Add Teacher" },
                    {
                      to: "/dashboard/teacher-attendance",
                      label: "Teacher Attendance",
                    },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center text-[13px] px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 ${
                          isActive ? "bg-white/15 text-white" : ""
                        }`
                      }
                    >
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setOpenInventory((p) => !p)}
                className={`
                  ${baseLink} w-full justify-between
                  ${openInventory ? "bg-white/10" : ""}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/25 to-orange-500/10 text-rose-300 group-hover:text-rose-200">
                    <MdInventory2 />
                  </span>
                  {isOpen && <span>Inventory</span>}
                </div>
                {isOpen && (
                  <span className="text-slate-400">
                    {openInventory ? <MdExpandLess /> : <MdExpandMore />}
                  </span>
                )}
              </button>

              <div
                className={`
                  overflow-hidden transition-all duration-200 origin-top
                  ${openInventory ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}
                `}
              >
                <div className="ml-4 border-l border-white/10 pl-3 mt-1 space-y-1">
                  {[
                    { to: "/dashboard/item", label: "Items" },
                    { to: "/dashboard/stock", label: "Stock" },
                    { to: "/dashboard/payment", label: "Payment" },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center text-[13px] px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 ${
                          isActive ? "bg-white/15 text-white" : ""
                        }`
                      }
                    >
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-rose-400" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* TEACHER SECTION */}
        {role === "teacher" && (
          <>
            {isOpen && (
              <p className="mt-3 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Teacher Tools
              </p>
            )}

            <NavLink
              to="/dashboard/qrcode-scanner"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 to-emerald-400/10 text-emerald-300 group-hover:text-emerald-200">
                <FaUsers />
              </span>
              {isOpen && <span>Scan QR</span>}
            </NavLink>

            <NavLink
              to="/dashboard/attendance"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/25 to-sky-400/10 text-sky-300 group-hover:text-sky-200">
                <FaClipboardList />
              </span>
              {isOpen && <span>Attendance</span>}
            </NavLink>

            <NavLink
              to="/dashboard/student-daily-attendance"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/25 to-indigo-400/10 text-indigo-300 group-hover:text-indigo-200">
                <SiGooglesheets />
              </span>
              {isOpen && <span>Student Daily Attendance</span>}
            </NavLink>

            <NavLink
              to="/dashboard/student-attendance-sheet"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/25 to-pink-500/15 text-fuchsia-300 group-hover:text-fuchsia-200">
                <FaFileDownload />
              </span>
              {isOpen && <span>Download Attendance Sheet</span>}
            </NavLink>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="relative border-t border-white/10 px-4 py-3 text-[11px] text-slate-500 flex items-center justify-between">
        {isOpen ? (
          <>
            <span>© {new Date().getFullYear()} Classic School</span>
            <span className="text-sky-400 font-semibold">v1.0</span>
          </>
        ) : (
          <span className="mx-auto text-sky-400 font-semibold">v1.0</span>
        )}
        
      </div>
    </aside>
    </div>
  );
};

export default Sidebar;
