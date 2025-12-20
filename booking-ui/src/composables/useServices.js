import { ref } from 'vue'
import { serviceAPI } from '@/helpers/api'

export default function useServices() {
  const services = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchServices = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await serviceAPI.getAll()
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
      const res = await serviceAPI.get(id)
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
      await serviceAPI.create(data)
      await fetchServices()
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
      await serviceAPI.update(id, data)
      await fetchServices()
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
      await serviceAPI.delete(id)
      services.value = services.value.filter(s => s.id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    services,
    loading,
    error,
    fetchServices,
    getService,
    createService,
    updateService,
    deleteService
  }
}
