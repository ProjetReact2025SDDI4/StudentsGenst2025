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
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
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
    getEvolutionStats: (params) => api.get('/inscriptions/stats/evolution', { params }),
    updateStatus: (id, status) => api.put(`/inscriptions/${id}`, { statut: status }),
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
    delete: (id) => api.delete(`/plannings/${id}`),
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
    getAll: (params) => api.get('/candidatures', { params }),
    approve: (id, data) => api.put(`/candidatures/${id}/accept`, data),
    reject: (id, data) => api.put(`/candidatures/${id}/reject`, data),
};

export const evaluationAPI = {
    submit: (data) => api.post('/evaluations', data),
    getAll: (params) => api.get('/evaluations', { params }),
    getById: (id) => api.get(`/evaluations/${id}`),
    getStatsByFormateur: (formateurId) => api.get(`/evaluations/formateur/${formateurId}/stats`),
    getStatsByFormation: (formationId) => api.get(`/evaluations/formation/${formationId}/stats`),
};

export default api;
