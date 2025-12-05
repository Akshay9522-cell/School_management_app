// src/api/busApi.ts
import { api } from "./api";

export const getAllBuses = () => api.get("/buses/get");
