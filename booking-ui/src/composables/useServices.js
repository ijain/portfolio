import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1/services'

export default function useServices() {
  const services = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchServices = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      services.value = res.data.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
    } finally {
      loading.value = false
    }
  }

  const getService = async (id) => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createService = async (data) => {
    loading.value = true
    error.value = null
    try {
      await axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateService = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await axios.put(`${API_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteService = async (id) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      services.value = services.value.filter((s) => s.id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return { services, loading, error, fetchServices, getService, createService, updateService, deleteService }
}
