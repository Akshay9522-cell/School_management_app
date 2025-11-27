import { Navigate } from "react-router-dom";
import { getRole, getToken } from "../utils/auth";
import type { JSX } from "react";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = getToken();
  const role = getRole();

  if (!token) return <Navigate to="/admin/login" replace />;

  if (!["admin", "teacher"].includes(role || "")) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
