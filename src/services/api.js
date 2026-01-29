import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor: Sirf ek baar kafi hai
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle 401 and 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401: Token Expired / Invalid
    if (status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // 403: Forbidden / Expired (Hamara case)
    // Hum yahan se reject karenge taake Context ise handle kare
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout')
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};


// Articles API
export const articlesAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getOne: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
  getStats: () => api.get('/articles/stats')
};

// Config API
export const configAPI = {
  getConfig: () => api.get('/config'),
  getOptions: () => api.get('/options'),
  getRateCategories: () => api.get('/config/rate-categories')
};

// Options API
export const optionsAPI = {
  getAll: () => api.get('/options'),
  
  // Single Unified Method for all types
  updateConfig: (type, action, data) => {
    // type: seasons, fabric_types, rateCategories
    // data: { value, index, category }
    const url = data.category 
      ? `/options/${type}/${data.category}` 
      : `/options/${type}`;
    return api.post(url, { ...data, action });
  }
};