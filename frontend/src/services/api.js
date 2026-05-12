import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Loan APIs
export const loanAPI = {
  apply: (data) => api.post('/loan/apply', data),
  getMyLoans: () => api.get('/loan/my-loans'),
  getLoanById: (id) => api.get(`/loan/${id}`),
  getAllLoans: (params) => api.get('/loan/all', { params }),
  reviewLoan: (id) => api.put(`/loan/${id}/review`),
  approveLoan: (id, data) => api.put(`/loan/${id}/approve`, data),
  rejectLoan: (id, data) => api.put(`/loan/${id}/reject`, data),
  getEMISchedule: (loanId) => api.get(`/loan/emi/${loanId}`),
};

// Payment APIs
export const paymentAPI = {
  createSession: (data) => api.post('/payment/create-session', data),
  verifyPayment: (sessionId) => api.get(`/payment/verify/${sessionId}`),
  getHistory: () => api.get('/payment/history'),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}`, data),
  getDefaulters: () => api.get('/admin/defaulters'),
};

// Notification APIs
export const notificationAPI = {
  getAll: () => api.get('/admin/notifications'),
  markRead: (id) => api.put(`/admin/notifications/${id}/read`),
  markAllRead: () => api.put('/admin/notifications/read-all'),
};

// Document APIs
export const documentAPI = {
  upload: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getByLoan: (loanId) => api.get(`/documents/loan/${loanId}`),
  verify: (id, data) => api.put(`/documents/${id}/verify`, data),
};

export default api;
