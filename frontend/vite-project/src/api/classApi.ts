import {api} from './api'

interface ClassQuery {
  page?: number;
  limit?: number;
  search?: string;
  teacher?: string;
}

export const getClasses = (query: ClassQuery) =>
  api.get("/classes/all", { params: query });


export const getClassById = (id: string) => api.get(`/classes/${id}`);
export const addClass = (data: any) => api.post("/classes/create", data);
export const updateClass = (id: string, data: any) =>
  api.put(`/classes/${id}`, data);
export const deleteClass = (id: string) => api.delete(`/classes/${id}`);