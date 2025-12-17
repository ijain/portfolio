import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // your API base URL
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/token', { email, password }),
  testToken: () => api.get('/test-token')
};

// Booking API
export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  get: id => api.get(`/bookings/${id}`),
  create: data => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: id => api.delete(`/bookings/${id}`)
};

// Service API
export const serviceAPI = {
  getAll: () => api.get('/services'),
  get: id => api.get(`/services/${id}`),
  create: data => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: id => api.delete(`/services/${id}`)
};

export default api;
