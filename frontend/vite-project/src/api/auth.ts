import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export const loginAdmin = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};
