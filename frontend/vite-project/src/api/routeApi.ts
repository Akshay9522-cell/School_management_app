import {api} from './api'


export const getAllRoutes = () => api.get("/route/get");
export const createRouteApi = (payload: any) => api.post("/route/create-route", payload);
export const updateRouteApi = (id: string, payload: any) => api.put(`/route/${id}`, payload);
export const deleteRouteApi = (id: string) => api.delete(`/route/${id}`);
export const getRouteById = (id: string) => api.get(`/route/${id}`);