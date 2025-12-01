import {api} from './api'


export const getAttendanceSummary = (date: string) =>
  api.get(`/attendance/summary`, { params: { date } });
