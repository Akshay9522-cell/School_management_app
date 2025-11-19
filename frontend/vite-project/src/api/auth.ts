import { api } from "./api";
import { setToken } from "../utils/auth";

export const loginAdmin = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });

  // Save token after login
  setToken(res.data.token);

  return res.data;
};
