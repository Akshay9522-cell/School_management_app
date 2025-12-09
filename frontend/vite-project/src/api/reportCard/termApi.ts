import { api } from "../api";

export const createTerm = async (data: any) => {
  return await api.post("/reports/terms", data);
};

export const getTerms = async () => {
  return await api.get('/reports/terms');
};

export const createExam = async (data: any) => {
  return await api.post("/reports/exams", data);
};

export const getAllExams = async () => {
  return await api.get('/reports/exams');
};

export const getExamsByTerm = async (termId: string) => {
  return await api.get(`/reports/exams/term/${termId}`);
};

export const addDateSheet = async (data: any) => {
  return await api.post(`/reports/datasheet`, data);
};

export const getDateSheet = async (classId: string, examId: string) => {
  return await api.get(`/reports/datasheet/${examId}/${classId}`);
};

export const createSubject = async (data: any) => {
  return await api.post(`/subjects/create`, data);
};

export const getSubjectsByClass = async (classId: string) => {
  return await api.get(`/subjects/class/${classId}`);
};

export const deleteSubject = async (subjectId: string) => {
  return await api.delete(`subjects/${subjectId}`);
};

export const updateSubject = async (subjectId: string, data: any) => {
  return await api.put(`/subjects/${subjectId}`, data);
};