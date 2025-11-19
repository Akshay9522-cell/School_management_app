import axios from "axios";
import { getToken } from "../utils/auth";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Always attach token
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
