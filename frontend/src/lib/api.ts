import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    login: (credentials: any) => api.post('/auth/login', credentials),
};

export const studentService = {
    getAll: () => api.get('/students'),
    getStudents: () => api.get('/students'),
    getById: (id: number) => api.get(`/students?id=${id}`),
};

export const attendanceService = {
    getForStudent: (studentId: number) => api.get(`/attendance?studentId=${studentId}`),
    markAttendance: (data: any) => api.post('/attendance', data),
};

export const resultService = {
    getForStudent: (studentId: number) => api.get(`/results?studentId=${studentId}`),
    uploadResult: (data: any) => api.post('/results', data),
};

export const feeService = {
    getForStudent: (studentId: number) => api.get(`/fees?studentId=${studentId}`),
};

export const circularService = {
    getAll: () => api.get('/circulars'),
    post: (data: any) => api.post('/circulars', data),
};

export const admissionService = {
    submit: (data: any) => api.post('/admission', data),
    getAdmissions: () => api.get('/admission'),
};

export default api;
