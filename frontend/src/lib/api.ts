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
    getById: (id: number) => api.get(`/students/${id}`),
    create: (data: any) => api.post('/students', data),
    update: (id: number, data: any) => api.put(`/students/${id}`, data),
    delete: (id: number) => api.delete(`/students/${id}`),
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
    create: (data: any) => api.post('/fees', data),
};

export const circularService = {
    getAll: () => api.get('/circulars'),
    post: (data: any) => api.post('/circulars', data),
    update: (id: number, data: any) => api.put(`/circulars/${id}`, data),
    delete: (id: number) => api.delete(`/circulars/${id}`),
};

export const admissionService = {
    submit: (data: any) => api.post('/admission', data),
    getAdmissions: () => api.get('/admission'),
    update: (id: number, data: any) => api.put(`/admission/${id}`, data),
};

export const photoService = {
    getAll: () => api.get('/photos'),
    upload: (data: any) => api.post('/photos', data),
    delete: (id: number) => api.delete(`/photos/${id}`),
};

export const stationeryService = {
    getAll: () => api.get('/stationery'),
    create: (data: any) => api.post('/stationery', data),
    update: (id: number, data: any) => api.put(`/stationery/${id}`, data),
    delete: (id: number) => api.delete(`/stationery/${id}`),
};

export const orderService = {
    getAll: () => api.get('/orders'),
    create: (data: any) => api.post('/orders', data),
    update: (id: number, data: any) => api.put(`/orders/${id}`, data),
};

export default api;
