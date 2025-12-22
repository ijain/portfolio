import { ref } from 'vue'
import { serviceAPI } from '@/helpers/api'

export default function useServices() {
  const services = ref([])
  const loading = ref(false)
  const error = ref(null)

  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  })

  const fetchServices = async (page = pagination.value.currentPage || 1) => {
    loading.value = true
    error.value = null

    try {
      const res = await serviceAPI.getAll({ page })
      services.value = res.data.data

      pagination.value = {
        currentPage: res.data.current_page,
        lastPage: res.data.last_page,
        perPage: res.data.per_page,
        total: res.data.total,
      }
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
      await fetchServices(pagination.value.currentPage)
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
      await fetchServices(pagination.value.currentPage)
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
      services.value = services.value.filter(service => service.id !== id)
      await fetchServices(pagination.value.currentPage)
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    services,
    pagination,
    loading,
    error,
    fetchServices,
    getService,
    createService,
    updateService,
    deleteService
  }
}
