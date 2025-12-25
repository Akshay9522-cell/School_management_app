import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import {  getUserName } from "../utils/auth";
import toast, { Toaster } from "react-hot-toast";

const Navbar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const userName = getUserName();
  const role = Cookies.get("role");   // <--- GET ROLE FROM COOKIES

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");

    if (role === "admin") {

    navigate("/admin/login");
    toast.success("Logout  successfully")
    }else navigate("/admin/login");
  };

  return (
    <div className="h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 flex items-center justify-between px-4 border-b border-white/10 shadow-md backdrop-blur-lg">
  {/* Left: menu */}
  <button
    onClick={onToggleSidebar}
    className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white transition"
  >
    <FaBars size={18} />
  </button>

  <h1
    className="
      inline-flex items-center
      mr-150      rounded-2xl
      border border-white/20
      bg-white/10
      px-4 py-2
      text-sm font-medium
      text-slate-100
      shadow-lg shadow-sky-500/25
      backdrop-blur-md
    "
  >
    <span className="mr-5">Welcome!</span>
    <span
  className="
    -ml-1 mr-2 flex h-8 w-8 items-center justify-center
    rounded-full
    bg-gradient-to-br from-sky-500 to-indigo-500
    text-xs font-bold text-white
  "
>
  {userName?.charAt(0).toUpperCase()}
</span>
<span className="drop-shadow-sm tracking-wide">
  {userName}
</span>

  </h1>

      

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="bg-gray-200 px-3 py-1 rounded-full"
        >
          {role === "admin" ? "Admin" : "Teacher"} ▼
        </button>

        {open && (
          <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-32 p-2">
            <button
              onClick={logout}
              className="text-red-600 px-3 py-2 w-full text-left hover:bg-gray-100 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
  <Toaster/>
    </div>
  );
};

export default Navbar;
