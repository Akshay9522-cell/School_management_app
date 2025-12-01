import { api } from "./api";

export interface AttendanceSummaryParams {
  classId: string;
  studentId?: string;
  startDate: string;
  endDate: string;
}


export const markDailyAttendance = async (payload: any) => {
  return await api.post("/attendance/mark", payload); // Correct path
};





export const getAttendanceSummary = async (params: AttendanceSummaryParams) => {
  const query: Record<string, string> = {
    classId: params.classId,
    startDate: params.startDate,
    endDate: params.endDate,
  };
  if (params.studentId) query.studentId = params.studentId;

  return api.get(`/attendance/summary?${new URLSearchParams(query).toString()}`);
};


