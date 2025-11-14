import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = getToken();

  if (!token) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
