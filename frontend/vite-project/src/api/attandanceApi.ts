import api from "./dashboard"; // Axios instance with token

// ====== Types ======
export type AttendanceStatus = "present" | "absent" | "leave";

export interface IAttendance {
  _id?: string;
  student: string;        // student _id
  class: string;          // class _id
  date: string;           // ISO string
  status: AttendanceStatus;
}

export interface IBulkAttendance {
  classId: string;
  date: string;
  students: { student: string; status: AttendanceStatus }[];
}

// ====== API Functions ======

// Single attendance
export const addAttendance = (data: IAttendance) =>
  api.post<{ success: boolean; data: IAttendance }>("/attendance/add", data);

export const getAttendances = (params?: any) =>
  api.get<{
      totalPages: number; success: boolean; data: IAttendance[] 
}>("/attendance/all", { params });

export const getAttendanceById = (id: string) =>
  api.get<{ success: boolean; data: IAttendance }>(`/attendance/${id}`);

export const updateAttendance = (id: string, data: Partial<IAttendance>) =>
  api.put<{ success: boolean; data: IAttendance }>(`/attendance/${id}`, data);

export const deleteAttendance = (id: string) =>
  api.delete<{ success: boolean; message: string }>(`/attendance/${id}`);

// Bulk attendance
export const bulkAttendance = (data: IBulkAttendance) =>
  api.post<{ success: boolean; data: any }>("/attendance/bulk", data);
