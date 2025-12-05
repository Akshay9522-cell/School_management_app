import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaUsers, FaChalkboardTeacher, FaSchool, FaClipboardList, FaHome,FaFileDownload, FaBus } from "react-icons/fa";
import { MdInventory2, MdExpandLess, MdExpandMore, } from "react-icons/md";
import { SiGooglesheets } from "react-icons/si";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

interface Bus{
  _id:string
}

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const [openInventory, setOpenInventory] = useState(false);
  const [openTeacher, setOpenTeacher] = useState(false);
  const[buses,setBuses]=useState<Bus[]>([])


   async function bus(){
      let api="http://localhost:4000/api/buses/get"
     await axios.get(api).then((res)=>{
      console.log(res.data.buses)
      setBuses(res.data.buses)
     })
   }
  useEffect(()=>{

    bus()

  },[])

  const role = Cookies.get("role");

  return (
    <div
      className={`bg-white border-r h-full flex flex-col space-y-4 transition-all duration-300
        ${isOpen ? "w-54" : "w-0 overflow-hidden"}
      `}
    >
      <h1 className="text-xl font-bold">School Dashboard</h1>

      <nav className="flex flex-col space-y-1">

        {/* HOME */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded 
             ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
          }
        >
          <FaHome /> Home
        </NavLink>

        {/* ---------------------------
              ADMIN SECTION
        ---------------------------- */}
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

            {
              buses.map((bus)=>{

                return(
                   <NavLink
                    key={bus._id}
             to={`/dashboard/bustracking/${bus._id}`}
             
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded 
                 ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
              }
            >
              <FaBus />Bus TRacking 
            </NavLink>
                )
              })
            }
           

            {/* ---------------------------
                  TEACHER DROPDOWN
            ---------------------------- */}
            <button
              onClick={() => setOpenTeacher(!openTeacher)}
              className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-200"
            >
              <div className="flex items-center gap-2">
                <FaChalkboardTeacher /> Teachers
              </div>
              {openTeacher ? <MdExpandLess /> : <MdExpandMore />}
            </button>

            {openTeacher && (
              <div className="ml-8 flex flex-col space-y-1">

                <NavLink
                  to="/dashboard/teachers"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded ${
                      isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"
                    }`
                  }
                >
                  All Teachers
                </NavLink>

                <NavLink
                  to="/dashboard/pending-teachers"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded ${
                      isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"
                    }`
                  }
                >
                  Pending Teachers
                </NavLink>

                <NavLink
                  to="/dashboard/add-teacher"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded ${
                      isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"
                    }`
                  }
                >
                  Add Teacher
                </NavLink>

                 <NavLink
                  to="/dashboard/teacher-attendance"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded ${
                      isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"
                    }`
                  }
                >
                  Teacher Attandances
                </NavLink>
                

              </div>
            )}

            {/* Inventory Dropdown */}
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
                <NavLink to="/dashboard/item" className="px-3 py-1 hover:bg-gray-200 rounded">Items</NavLink>
                <NavLink to="/dashboard/stock" className="px-3 py-1 hover:bg-gray-200 rounded">Stock</NavLink>
                <NavLink to="/dashboard/payment" className="px-3 py-1 hover:bg-gray-200 rounded">Payment</NavLink>
              </div>
            )}
          </>
        )}

        {/* ---------------------------
              TEACHER SECTION
        ---------------------------- */}
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

              <NavLink
              to="/dashboard/student-daily-attendance"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded 
                 ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
              }
            >
             <SiGooglesheets /> Student Daily Attendance
            </NavLink>

            
              <NavLink
              to="/dashboard/student-attendance-sheet"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded 
                 ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200"}`
              }
            >
              <FaFileDownload />
 Download Attandance sheet
            </NavLink>
          </>
        )}

      </nav>
    </div>
  );
};

export default Sidebar;
