import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {

    const navigate=useNavigate()
    const handleLogout = () => {
    // Remove token from cookies
    Cookies.remove("token");

    // Redirect to login
    navigate("/admin/login");
  };
  return (
    <div className="h-16 bg-white flex items-center justify-between px-4 border-b">
      <h2 className="font-bold text-lg">Dashboard</h2>
      <div>User Admin</div>
         <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          background: "red",
          color: "white",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Logout
      </button>
   
    </div>
  );
};

export default Navbar;
