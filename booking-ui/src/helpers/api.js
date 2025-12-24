import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_VERSION = import.meta.env.VITE_API_VERSION

// Create an axios instance
const api = axios.create({
  baseURL: `${BASE_URL}/${API_VERSION}`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

let redirecting = false

api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401 && !redirecting) {
        redirecting = true
        localStorage.removeItem('token')

        setTimeout(() => {
          redirecting = false
          window.location.href = '/login'
        }, 0)
      }
      return Promise.reject(error)
    }
)

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
  getAll: (params = {}) => api.get('/bookings', { params }),
  get: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
}

// Service API
export const serviceAPI = {
  getAll: (params = {}) => api.get('/services', { params }),
  get: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
}

