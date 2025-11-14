import api from "axios";
import type { Student } from "../types/student";

export const getStudents = (params?: any) => api.get<{ records: Student[]; total: number }>("/students", { params });
export const addStudent = (data: Partial<Student>) => api.post<Student>("/students", data);
export const updateStudent = (id: string, data: Partial<Student>) => api.put<Student>(`/students/${id}`, data);
export const deleteStudent = (id: string) => api.delete(`/students/${id}`);
