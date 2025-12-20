import axios from 'axios'

// Get base URL and version from env
const BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_VERSION = import.meta.env.VITE_API_VERSION

// Create an axios instance
const api = axios.create({
  baseURL: `${BASE_URL}/${API_VERSION}`, // dynamic base URL
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach token automatically
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    },
    (error) => Promise.reject(error)
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/token', { email, password }),
  testToken: () => api.get('/test-token'),
}

// Booking API
export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  get: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
}

// Service API
export const serviceAPI = {
  getAll: () => api.get('/services'),
  get: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
}

export default api
