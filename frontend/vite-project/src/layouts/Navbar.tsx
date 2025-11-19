import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const Navbar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    Cookies.remove("token");
    navigate("/admin/login");
  };

  return (
    <div className="h-16 bg-white flex items-center justify-between px-4 border-b shadow-sm">

      {/* Sidebar Toggle Button */}
      <button onClick={onToggleSidebar} className="text-gray-600 text-xl">
        <FaBars />
      </button>

      <h2 className="font-bold text-lg">Dashboard</h2>

      {/* User Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="bg-gray-200 px-3 py-1 rounded-full"
        >
          Admin ▼
        </button>

        {/* Dropdown Menu */}
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
