import React, { useState,useEffect } from "react";
import { loginAdmin } from "../api/auth";
import { setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // for icons
import toast from "react-hot-toast";
import { getToken } from "../utils/auth"



const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email & Password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await loginAdmin(email, password);

      // Save Token to Cookies
      setToken(res.token);

      toast.success("Login successful!");

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    }

    setLoading(false);
  };
  useEffect(() => {
  const token = getToken();
  if (token) {
    navigate("/dashboard");
  }
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPass ? "text" : "password"}
              className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Toggle icon */}
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
