import {api} from "./api";

export const addTeacher = (data: any) => api.post("/teachers/add", data);
interface TeacherQuery {
  page?: number;
  limit?: number;
  search?: string;
  subject?: string;
  classIds?: string[];
}
export const updateTeacherClass = (teacherId: string, classIds: string[]) =>
  api.put(`/teachers/${teacherId}/class`, { classIds });

export const updateTeacherSubject = (teacherId: string, subject: string) =>
  api.put(`/teachers/${teacherId}/subject`, { subject });
export const getTeachers = (query: TeacherQuery) =>
  api.get("/teachers/all", { params: query });
export const deleteTeacher = (id: string) => api.delete(`/teachers/${id}`);
export const updateTeacher = (id: string, data: any) =>
  api.put(`/teachers/${id}`, data);
export const getTeacherById = (id: string) =>
  api.get(`/teachers/${id}`);
