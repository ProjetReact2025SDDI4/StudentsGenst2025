import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    updateMe: (data) => api.put('/auth/me', data),
    changePassword: (data) => api.put('/auth/password', data),
    getAllUsers: () => api.get('/auth/users'),
};

export const formationAPI = {
    getAll: (params) => api.get('/formations', { params }),
    getById: (id) => api.get(`/formations/${id}`),
    create: (data) => api.post('/formations', data),
    update: (id, data) => api.put(`/formations/${id}`, data),
    delete: (id) => api.delete(`/formations/${id}`),
    getCategories: () => api.get('/formations/categories'),
    getVilles: () => api.get('/formations/villes'),
};

export const userAPI = {
    getAll: () => api.get('/auth/users'),
    create: (data) => api.post('/auth/register', data),
    update: (id, data) => api.put(`/auth/users/${id}`, data),
    delete: (id) => api.delete(`/auth/users/${id}`),
};

export const inscriptionAPI = {
    create: (data) => api.post('/inscriptions', data),
    getAll: () => api.get('/inscriptions'),
    updateStatus: (id, status) => api.put(`/inscriptions/${id}/status`, { statut: status }),
};

export const formateurAPI = {
    getAll: () => api.get('/formateurs'),
    getById: (id) => api.get(`/formateurs/${id}`),
    create: (data) => api.post('/formateurs', data),
};

export const planningAPI = {
    getAll: () => api.get('/plannings'),
    create: (data) => api.post('/plannings', data),
    getById: (id) => api.get(`/plannings/${id}`),
};

export const entrepriseAPI = {
    getAll: () => api.get('/entreprises'),
    create: (data) => api.post('/entreprises', data),
    getById: (id) => api.get(`/entreprises/${id}`),
    update: (id, data) => api.put(`/entreprises/${id}`, data),
    delete: (id) => api.delete(`/entreprises/${id}`),
};

export const candidatureAPI = {
    create: (data) => api.post('/candidatures', data),
    getAll: () => api.get('/candidatures'),
    approve: (id) => api.put(`/candidatures/${id}/accept`),
};

export const evaluationAPI = {
    submit: (data) => api.post('/evaluations', data),
    getAll: () => api.get('/evaluations'),
    getStats: () => api.get('/evaluations/stats'),
};

export default api;
