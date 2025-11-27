import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useState } from "react";

const Navbar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const role = Cookies.get("role");   // <--- GET ROLE FROM COOKIES

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");

    if (role === "admin") navigate("/admin/login");
    else navigate("/admin/login");
  };

  return (
    <div className="h-16 bg-white flex items-center justify-between px-4 border-b shadow-sm">

      <button onClick={onToggleSidebar} className="text-gray-600 text-xl">
        <FaBars />
      </button>

      <h2 className="font-bold text-lg">Dashboard</h2>

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

    </div>
  );
};

export default Navbar;
