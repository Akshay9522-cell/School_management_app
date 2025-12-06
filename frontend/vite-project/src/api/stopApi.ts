import {api} from './api'


export const getAllStops = () => api.get("/stop/get");
export const createStopApi = (payload: any) => api.post("/stop/create", payload);
export const updateStopApi = (id: string, payload: any) => api.put(`/stop/${id}`, payload);
export const deleteStopApi = (id: string) => api.delete(`/stop/${id}`);
export const getStopById = (id: string) => api.get(`/stop/${id}`);