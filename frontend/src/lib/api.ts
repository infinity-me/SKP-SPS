import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});


// 🔐 Attach JWT token automatically
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = token;
        }
    }
    return config;
});


// ⚠️ Handle global errors (like 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);


/* ================= AUTH ================= */

export const authService = {
    login: async (credentials: any) => {
        const res = await api.post('/auth/login', credentials);

        // save token automatically
        if (res.data?.token) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        return res.data;
    },
};


/* ================= STUDENTS ================= */

export const studentService = {
    getAll: () => api.get('/students'),
    getById: (id: number) => api.get(`/students/${id}`),
    create: (data: any) => api.post('/students', data),
    update: (id: number, data: any) => api.put(`/students/${id}`, data),
    delete: (id: number) => api.delete(`/students/${id}`),
};


/* ================= TEACHERS ================= */

export const teacherService = {
    getAll: () => api.get('/teachers'),
    create: (data: any) => api.post('/teachers', data),
};


/* ================= ATTENDANCE ================= */

export const attendanceService = {
    getForStudent: (studentId: number) => api.get(`/attendance?studentId=${studentId}`),
    markAttendance: (data: any) => api.post('/attendance', data),
};


/* ================= RESULTS ================= */

export const resultService = {
    getForStudent: (studentId: number) => api.get(`/results?studentId=${studentId}`),
    uploadResult: (data: any) => api.post('/results', data),
};


/* ================= FEES ================= */

export const feeService = {
    getAll: () => api.get('/fees'),
    getForStudent: (studentId: number) => api.get(`/fees?studentId=${studentId}`),
    create: (data: any) => api.post('/fees', data),
};


/* ================= CIRCULAR ================= */

export const circularService = {
    getAll: () => api.get('/circulars'),
    post: (data: any) => api.post('/circulars', data),
    update: (id: number, data: any) => api.put(`/circulars/${id}`, data),
    delete: (id: number) => api.delete(`/circulars/${id}`),
};


/* ================= ADMISSION ================= */

export const admissionService = {
    submit: (data: any) => api.post('/admission', data),
    getAdmissions: () => api.get('/admission'),
    update: (id: number, data: any) => api.put(`/admission/${id}`, data),
};


/* ================= PHOTOS ================= */

export const photoService = {
    getAll: () => api.get('/photos'),
    upload: (data: any) => api.post('/photos', data),
    delete: (id: number) => api.delete(`/photos/${id}`),
};


/* ================= STATIONERY ================= */

export const stationeryService = {
    getAll: () => api.get('/stationery'),
    create: (data: any) => api.post('/stationery', data),
    update: (id: number, data: any) => api.put(`/stationery/${id}`, data),
    delete: (id: number) => api.delete(`/stationery/${id}`),
};


/* ================= ORDERS ================= */

export const orderService = {
    getAll: () => api.get('/orders'),
    create: (data: any) => api.post('/orders', data),
    update: (id: number, data: any) => api.put(`/orders/${id}`, data),
};


/* ================= ANALYTICS ================= */

export const analyticsService = {
    getStats: () => api.get('/analytics'),
};


export default api;