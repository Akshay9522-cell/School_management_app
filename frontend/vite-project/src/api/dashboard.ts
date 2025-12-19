import axios from "axios";
import { URL } from "../utils/config";
import { getToken } from "../utils/auth";

// Create axios instance
const api = axios.create({
  baseURL: URL, // example: http://localhost:4000/api/
});

// Attach token from Cookie
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// APIS
export const getStudentCount = () => api.get("students/all");
export const getTeacherCount = () => api.get("teachers");
export const getClassCount = () => api.get("classes/all");
export const getTodayAttendanceCount = () => api.get("attendance/all");

export const getTodayTeacherAttendanceSummary = (date: string) => {
  const token = getToken();
  return api.get(`/attendance/teacher/summary`, {
    params: { date },
    headers: {
      Authorization: `Bearer ${token || ""}`,
    },
  });
};


export default api;
