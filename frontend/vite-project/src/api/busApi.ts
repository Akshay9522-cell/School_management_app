// src/api/busApi.ts
import { api } from "./api";



export const getAllBuses = () => api.get("/buses/get");
export const createBusApi = (payload: any) => api.post("/buses/create-bus", payload);
export const updateBusApi = (id: string, payload: any) => api.put(`/buses/${id}`, payload);
export const deleteBusApi = (id: string) => api.delete(`/buses/${id}`);
export const assignRouteApi = (payload: { busId: string; routeId: string | null }) =>
  api.post("/buses/assign-route", payload);
export const updateLocationApi = (payload: any) => api.post("/buses/update-location", payload);
