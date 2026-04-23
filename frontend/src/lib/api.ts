import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
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
        if (res.data?.token) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        return res.data;
    },
    googleLogin: async (idToken: string, role: string = "guest") => {
        const res = await api.post('/auth/google', { idToken, role });
        if (res.data?.token) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        return res.data;
    },
    registerGuest: async (data: any) => {
        const res = await api.post('/auth/register-guest', data);
        if (res.data?.token) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        return res.data;
    },
    verifySchoolId: async (role: string, id: string) => {
        const res = await api.get(`/auth/verify-id?role=${role}&id=${id}`);
        return res.data;
    },
    getProfile: async () => {
        const res = await api.get('/auth/me');
        if (res.data?.user) {
            localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        return res.data;
    },
    updateProfile: async (data: any) => {
        const res = await api.put('/auth/profile', data);
        if (res.data?.user) {
            localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        return res.data;
    },
    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        const res = await api.post('/auth/upload-avatar', formData);
        if (res.data?.user) {
            localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        return res.data;
    }
};


/* ================= PUBLIC DATA ================= */

export const publicDataService = {
    getTeachers: () => api.get('/public/teachers'),
    getToppers: () => api.get('/public/toppers'),       // student-based (legacy)
    getBoardToppers: () => api.get('/board-toppers'),   // dedicated BoardTopper table
    getRules: () => api.get('/public/rules'),
    getStats: () => api.get('/public/stats'),
    getNotices: () => api.get('/public/notices'),
    getUpcomingEvents: () => api.get('/public/events/upcoming'),
    getRecentPhotos: () => api.get('/public/photos/recent'),
};


/* ================= BOARD TOPPERS (admin) ================= */

export const boardTopperService = {
    getAll: () => api.get('/admin/board-toppers'),
    create: (data: any) => api.post('/admin/board-toppers', data),
    update: (id: number, data: any) => api.put(`/admin/board-toppers/${id}`, data),
    delete: (id: number) => api.delete(`/admin/board-toppers/${id}`),
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
    update: (id: number, data: any) => api.put(`/teachers/${id}`, data),
    delete: (id: number) => api.delete(`/teachers/${id}`),
};


/* ================= ATTENDANCE ================= */

export const attendanceService = {
    getForStudent: (studentId: number) => api.get(`/attendance?studentId=${studentId}`),
    markAttendance: (data: any) => api.post('/attendance', data),
};


/* ================= RESULTS ================= */

export const resultService = {
    // Admin: get results for a specific student or term
    getAll: (params?: { studentId?: number; term?: string }) => {
        const qs = new URLSearchParams()
        if (params?.studentId) qs.set('studentId', String(params.studentId))
        if (params?.term) qs.set('term', params.term)
        return api.get(`/results?${qs.toString()}`)
    },
    create: (data: any) => api.post('/results', data),
    update: (id: number, data: any) => api.put(`/results/${id}`, data),
    delete: (id: number) => api.delete(`/results/${id}`),
    // Student: get own results
    getMy: () => api.get('/results/my'),
};


/* ================= FEES ================= */

export const feeService = {
    getAll: () => api.get('/fees'),
    getForStudent: (studentId: number) => api.get(`/fees?studentId=${studentId}`),
    create: (data: any) => api.post('/fees', data),
    update: (id: number, data: any) => api.put(`/fees/${id}`, data),
    delete: (id: number) => api.delete(`/fees/${id}`),
    
    // New automation methods
    lookup: (admissionNo: string) => api.get(`/fees/lookup/${admissionNo}`),
    pay: (feeId: number) => api.post(`/fees/pay/${feeId}`),
    generate: (month: string, year: number) => api.post('/fees/generate', { month, year }),
};


/* ================= FEE STRUCTURE (NEW) ================= */

export const feeStructureService = {
    getAll: () => api.get('/fee-structure'),
    create: (data: any) => api.post('/fee-structure', data),
    update: (id: number, data: any) => api.put(`/fee-structure/${id}`, data),
    delete: (id: number) => api.delete(`/fee-structure/${id}`),
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


/* ================= CALENDAR ================= */

export const calendarService = {
    getAll: () => api.get('/calendar'),
    create: (data: any) => api.post('/calendar', data),
    update: (id: number, data: any) => api.put(`/calendar/${id}`, data),
    delete: (id: number) => api.delete(`/calendar/${id}`),
};


/* ================= ANALYTICS ================= */

export const analyticsService = {
    getStats: () => api.get('/analytics'),
};


/* ================= TEACHER APPLICATIONS ================= */

export const teacherApplicationService = {
    submit: (data: any) => api.post('/teacher-application', data),
    getAll: () => api.get('/teacher-application'),
    update: (id: number, data: any) => api.put(`/teacher-application/${id}`, data),
};


/* ================= NOTICES ================= */

export const noticeService = {
    getActive: () => api.get('/notices'),
    getAll: () => api.get('/notices/all'),
    create: (data: any) => api.post('/notices', data),
    update: (id: number, data: any) => api.put(`/notices/${id}`, data),
    remove: (id: number) => api.delete(`/notices/${id}`),
};


/* ================= PAGES (CMS) ================= */

export const pageService = {
    getAll: () => api.get('/pages'),
    getById: (id: number) => api.get(`/pages/${id}`),
    getBySlug: (slug: string) => api.get(`/pages/slug/${slug}`),
    create: (data: any) => api.post('/pages', data),
    update: (id: number, data: any) => api.put(`/pages/${id}`, data),
    delete: (id: number) => api.delete(`/pages/${id}`),
};

/* ================= POPUP SETTINGS ================= */

export const popupService = {
    get: () => api.get('/settings/popup'),
    update: (data: any) => api.put('/settings/popup', data),
};


/* ================= CHATBOT ================= */

export const chatService = {
    sendMessage: (message: string, history: any[] = []) => api.post('/chat', { message, history }),
};

/* ================= BOT RULES ================= */

export const botRuleService = {
    getAll: () => api.get('/bot-rules'),
    create: (data: any) => api.post('/bot-rules', data),
    update: (id: number, data: any) => api.put(`/bot-rules/${id}`, data),
    delete: (id: number) => api.delete(`/bot-rules/${id}`),
};

/* ================= ADMISSION SETTINGS ================= */

export const admissionSettingsService = {
    get: () => api.get('/admissions/settings'),
    update: (data: any) => api.put('/admissions/settings', data),
    toggle: () => api.patch('/admissions/settings/toggle', {}),
};

/* ================= SITE CONTENT ================= */

export const siteContentService = {
    getAll: () => api.get('/site-content'),
    getBySection: (section: string) => api.get(`/site-content/${section}`),
    updateKey: (key: string, value: string, section?: string) => api.put(`/site-content/${key}`, { value, section }),
    bulkUpdate: (updates: Record<string, string>) => api.patch('/site-content', updates),
};

/* ================= GALLERY CATEGORIES ================= */

export const galleryCategoryService = {
    getAll: () => api.get('/gallery/categories'),
    create: (name: string) => api.post('/gallery/categories', { name }),
    update: (id: number, name: string, order?: number) => api.put(`/gallery/categories/${id}`, { name, order }),
    delete: (id: number) => api.delete(`/gallery/categories/${id}`),
};

export default api;