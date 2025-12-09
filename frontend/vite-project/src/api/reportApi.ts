import { api } from "./api";

export const addMark = (data: any) =>
  api.post("/marks/add", data);

export const getMarks = (classId: string, examId: string) =>
  api.get(`/marks/${classId}/${examId}`);
