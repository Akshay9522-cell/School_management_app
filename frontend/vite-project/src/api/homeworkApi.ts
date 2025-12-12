import { api } from "./api";
import type { AxiosResponse } from "axios";


export interface HomeworkPayload {
  classId: string;
  subject: string;
  teacherId: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string from input[type="date"]
  attachment?: string;
}
export interface PopulatedClass {
  _id: string;
  name?: string;
  section?: string;
}

export interface PopulatedTeacher {
  _id: string;
  name: string;
  subject?: string;
}

export interface HomeworkType {
  _id: string;
  classId: string | PopulatedClass;
  subject: string;
  teacherId: string | PopulatedTeacher;
  title: string;
  description?: string;
  attachment?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const createHomeworkApi = async (
  payload: HomeworkPayload
): Promise<HomeworkType> => {
  const res: AxiosResponse<{ homework: HomeworkType }> = await api.post(
    "/homework/create",
    payload
  );
  return res.data.homework;
};

export const getClassHomeworkApi = async (
 
): Promise<HomeworkType[]> => {
  const res: AxiosResponse<HomeworkType[]> = await api.get(
    `/homework/class/`
  );
  return res.data;
};

export const getTeacherHomeworkApi = async (
  teacherId: string
): Promise<HomeworkType[]> => {
  const res: AxiosResponse<HomeworkType[]> = await api.get(
    `/homework/teacher/${teacherId}`
  );
  return res.data;
};