import { useEffect, useState, type JSX } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Cookies from "js-cookie";
import axios from "axios";

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

interface Bus {
  _id: string;
  name?: string;
}

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const [openInventory, setOpenInventory] = useState(false);
  const [openTeacher, setOpenTeacher] = useState(false);
  const [openTransport, setOpenTransport] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);

  const role = Cookies.get("role");
  const navigate = useNavigate();

  const baseLink =
    "group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-slate-300 hover:text-white hover:bg-white/10";
  const activeLink = "bg-white/15 text-white shadow-sm shadow-sky-500/40";

  useEffect(() => {
    if (role === "admin") {
      axios.get("http://localhost:4000/api/buses/get").then((res) => {
        setBuses(res.data.buses || []);
      });
    }
  }, [role]);

  const renderDropdown = (
    title: string,
    icon: JSX.Element,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    items: { to: string; label: string }[],
    dynamicItems?: { to: string; label: string }[]
  ) => (
    <div className="space-y-1">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`${baseLink} w-full justify-between ${open ? "bg-white/10" : ""}`}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/25 to-orange-500/10 text-rose-300 group-hover:text-rose-200">
            {icon}
          </span>
          {isOpen && <span>{title}</span>}
        </div>
        {isOpen && (
          <span className="text-slate-400">
            {open ? <MdExpandLess /> : <MdExpandMore />}
          </span>
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 origin-top ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-4 border-l border-white/10 pl-3 mt-1 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center text-[13px] px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 ${
                  isActive ? activeLink : ""
                }`
              }
            >
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-rose-400" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          {dynamicItems?.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center text-[13px] px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 ${
                  isActive ? activeLink : ""
                }`
              }
            >
              <span className="mr-2 text-xs">🚍</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );

  // Voice commands (you can further split by role if you want)
  const commands = [
    // Global
    {
      command: ["go to home", "open home", "dashboard"],
      callback: () => navigate("/dashboard"),
    },
    // Admin commands
    {
      command: ["open students", "go to students"],
      callback: () => navigate("/dashboard/students"),
    },
    {
      command: ["open qr generator", "go to qr generator"],
      callback: () => navigate("/dashboard/qrcodepage"),
    },
    {
      command: ["open transport", "open transport management"],
      callback: () => setOpenTransport(true),
    },
    {
      command: ["add bus"],
      callback: () => navigate("/dashboard/create-bus"),
    },
    {
      command: ["student transport info"],
      callback: () => navigate("/dashboard/get-student-by-bus-route"),
    },
    {
      command: ["open inventory"],
      callback: () => setOpenInventory(true),
    },
    {
      command: ["inventory reports", "open inventory reports"],
      callback: () => navigate("/dashboard/reports"),
    },
    // Teacher commands
    {
      command: ["take attendance", "open attendance"],
      callback: () => navigate("/dashboard/attendance"),
    },
    {
      command: ["student daily attendance"],
      callback: () => navigate("/dashboard/student-daily-attendance"),
    },
    {
      command: ["download attendance sheet"],
      callback: () => navigate("/dashboard/student-attendance-sheet"),
    },
    {
      command: ["create report card"],
      callback: () => navigate("/dashboard/report-card"),
    },
    {
      command: ["create homework"],
      callback: () => navigate("/dashboard/create-hw"),
    },
    {
      command: ["class homework"],
      callback: () => navigate("/dashboard/class-hw"),
    },
    {
      command: ["teacher homework"],
      callback: () => navigate("/dashboard/teacher-hw"),
    },
  ];

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition({ commands });

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) return;
    if (!listening) {
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-IN",
      });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  return (
    <aside
      className={`relative z-20 h-screen ${
        isOpen ? "w-64" : "w-0"
      } transition-[width] duration-300 bg-slate-950/80 border-r border-white/10 backdrop-blur-xl flex flex-col`}
    >
      {/* Glow Border */}
      <div className="pointer-events-none absolute inset-0 rounded-r-3xl border border-white/10 shadow-[0_0_35px_rgba(59,130,246,0.45)]" />

      {/* Header with voice button */}
      <div className="relative flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/10">
        {isOpen && (
          <div className="flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow-lg shadow-sky-500/40 text-white font-black text-lg">
              SD
            </div>
            <h1 className="text-base font-semibold text-white tracking-wide">
              School Dashboard
            </h1>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Classic Admin Panel
            </p>
          </div>
        )}

        {browserSupportsSpeechRecognition && (
          <button
            onClick={toggleListening}
            className={`flex items-center justify-center h-9 w-9 rounded-full border text-xs ${
              listening
                ? "border-rose-400 text-rose-300 bg-rose-500/10"
                : "border-slate-600 text-slate-300 bg-slate-900/60"
            }`}
            title={listening ? "Stop Voice Control" : "Start Voice Control"}
          >
            {listening ? "🎙" : "🎤"}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {isOpen && (
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Main
          </p>
        )}

        {/* Home */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-400/10 text-sky-300 group-hover:text-sky-200">
            <FaHome />
          </span>
          {isOpen && <span>Home</span>}
        </NavLink>

        {role === "admin" && (
          <>
            {isOpen && (
              <p className="mt-3 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Administration
              </p>
            )}

            <NavLink
              to="/dashboard/students"
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 to-emerald-400/10 text-emerald-300 group-hover:text-emerald-200">
                <FaUsers />
              </span>
              {isOpen && <span>Students</span>}
            </NavLink>

            <NavLink
              to="/dashboard/qrcodepage"
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/25 to-fuchsia-500/10 text-violet-300 group-hover:text-violet-200">
                <FaUsers />
              </span>
              {isOpen && <span>QR Generator</span>}
            </NavLink>

            {/* Transport Dropdown */}
            {renderDropdown(
              "Transport Management",
              <FaBus />,
              openTransport,
              setOpenTransport,
              [
                { to: "/dashboard/create-bus", label: "Add Bus" },
                { to: "/dashboard/create-route", label: "Add Route" },
                { to: "/dashboard/create-stop", label: "Create Stop" },
                { to: "/dashboard/bus-assign", label: "Assign Bus" },
                {
                  to: "/dashboard/get-student-by-bus-route",
                  label: "Student Transport Info",
                },
              ],
              buses.map((bus) => ({
                to: `/dashboard/bustracking/${bus._id}`,
                label: "Bus Tracking",
              }))
            )}

            {/* Teacher Dropdown */}
            {renderDropdown(
              "Teachers",
              <FaChalkboardTeacher />,
              openTeacher,
              setOpenTeacher,
              [
                { to: "/dashboard/teachers", label: "All Teachers" },
                { to: "/dashboard/pending-teachers", label: "Pending Teachers" },
                { to: "/dashboard/add-teacher", label: "Add Teacher" },
                { to: "/dashboard/teacher-attendance", label: "Teacher Attendance" },
              ]
            )}

            {/* Inventory Dropdown */}
            {renderDropdown(
              "Inventory",
              <MdInventory2 />,
              openInventory,
              setOpenInventory,
              [
                { to: "/dashboard/categoryList", label: "Category List" },
                { to: "/dashboard/itemList", label: "Item List" },
                { to: "/dashboard/vendorList", label: "Vendor" },
                { to: "/dashboard/POList", label: "Purchase Order" },
                { to: "/dashboard/issueList", label: "Issue" },
                { to: "/dashboard/reports", label: "Reports" },
                { to: "/dashboard/returnList", label: "return" },
                { to: "/dashboard/addStock", label: "addStock" },
                { to: "/dashboard/report-card", label: "ReportCard" },
              ]
            )}
          </>
        )}

        {/* Teacher Section */}
        {role === "teacher" && (
          <>
            {isOpen && (
              <p className="mt-3 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Teacher Tools
              </p>
            )}

            {/* <NavLink
              to="/dashboard/ai"
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/25 to-pink-500/15 text-fuchsia-300 group-hover:text-fuchsia-200">
                <FaFileDownload />
              </span>
              {isOpen && <span>Smart paper Creator</span>}
            </NavLink> */}

            <NavLink
              to="/dashboard/sdr"
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 to-emerald-400/10 text-emerald-300 group-hover:text-emerald-200">
                <FaUsers />
              </span>
              {isOpen && <span>Student daily reports</span>}
            </NavLink>

            <NavLink
              to="/dashboard/qrcode-scanner"
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 to-emerald-400/10 text-emerald-300 group-hover:text-emerald-200">
                <FaUsers />
              </span>
              {isOpen && <span>Scan QR</span>}
            </NavLink>

            {/* <NavLink
              to="/dashboard/attendance"
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/25 to-sky-400/10 text-sky-300 group-hover:text-sky-200">
                <FaClipboardList />
              </span>
              {isOpen && <span>Attendance</span>}
            </NavLink> */}

            <NavLink
              to="/dashboard/student-daily-attendance"
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/25 to-indigo-400/10 text-indigo-300 group-hover:text-indigo-200">
                <SiGooglesheets />
              </span>
              {isOpen && <span>Student Daily Attendance</span>}
            </NavLink>

            <NavLink
              to="/dashboard/student-attendance-sheet"
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/25 to-pink-500/15 text-fuchsia-300 group-hover:text-fuchsia-200">
                <FaFileDownload />
              </span>
              {isOpen && <span>Download Attendance Sheet</span>}
            </NavLink>

            <NavLink
              to="/dashboard/report-card"
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/25 to-pink-500/15 text-fuchsia-300 group-hover:text-fuchsia-200">
                <FaFileDownload />
              </span>
              {isOpen && <span>Create Report-Card</span>}
            </NavLink>

            <NavLink
              to="/dashboard/create-hw"
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/25 to-pink-500/15 text-fuchsia-300 group-hover:text-fuchsia-200">
                <FaFileDownload />
              </span>
              {isOpen && <span>Create Homework</span>}
            </NavLink>
{/* 
            <NavLink
              to="/dashboard/class-hw"
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/25 to-pink-500/15 text-fuchsia-300 group-hover:text-fuchsia-200">
                <FaFileDownload />
              </span>
              {isOpen && <span>Class HomeWork</span>}
            </NavLink> */}

            {/* <NavLink
              to="/dashboard/teacher-hw"
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/25 to-pink-500/15 text-fuchsia-300 group-hover:text-fuchsia-200">
                <FaFileDownload />
              </span>
              {isOpen && <span>Teacher HomeWork</span>}
            </NavLink> */}
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

      {/* Optional: show transcript while testing */}
      {browserSupportsSpeechRecognition && listening && (
        <div className="px-4 pb-2 text-[10px] text-slate-500 italic line-clamp-1">
          Listening: {transcript}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
