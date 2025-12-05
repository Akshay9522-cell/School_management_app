// src/api/bulkApi.ts
import { api } from "./api";

export const assignBusInBulk = (busId: string, studentIds: string[]) =>
  api.post("/students/bus-assign", {
    busId,
    studentIds,
  });

export const fetchRoute=()=>
    api.get('/route/get')
