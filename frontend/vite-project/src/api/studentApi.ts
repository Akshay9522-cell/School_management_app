    import {api} from './api';

    export const addStudent = (data: any) => api.post("/students/add", data);

    export const getStudents = (query: string = " ") =>
    api.get(`/students/all${query}`);

    export const getStudentsByClass = (classId: string, query?: any) =>
    api.get("/students/all", {
    params: { classId, ...query },
    
  });

    export const getStudentById = (id: string) =>
    api.get(`/students/${id}`);

    export const updateStudent = (id: string, data: any) =>
    api.put(`/students/${id}`, data);

    export const deleteStudent = (id: string) =>
    api.delete(`/students/${id}`);
