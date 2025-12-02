import { api } from "./api";

export interface AttendanceSummaryParams {

  classId: string;
  studentId?: string;
  date:string
}


export const markDailyAttendance = async (payload: any) => {
  return await api.post("/attendance/mark", payload); // Correct path
};





export const getAttendanceSummary = async (params: AttendanceSummaryParams) => {
  const query: Record<string, string> = {
    classId: params.classId,
    date: params.date,
 
  };
  if (params.studentId) query.studentId = params.studentId;

  return api.get(`/attendance/studentsummary?${new URLSearchParams(query).toString()}`);
};


