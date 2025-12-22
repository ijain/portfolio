import { ref } from 'vue'
import { bookingAPI } from '@/helpers/api'

export default function useBookings() {
  const bookings = ref([])
  const loading = ref(false)
  const error = ref(null)

  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  })

  const fetchBookings = async (page = pagination.value.currentPage || 1) => {
    loading.value = true
    error.value = null

    try {
      const res = await bookingAPI.getAll({ page })
      bookings.value = res.data.data

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

  const getBooking = async (id) => {
    loading.value = true
    error.value = null

    try {
      const res = await bookingAPI.get(id)
      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createBooking = async (data) => {
    loading.value = true
    error.value = null

    try {
      await bookingAPI.create(data)
      await fetchBookings(pagination.value.currentPage)
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBooking = async (id, data) => {
    loading.value = true
    error.value = null

    try {
      await bookingAPI.update(id, data)
      await fetchBookings(pagination.value.currentPage)
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteBooking = async (id) => {
    loading.value = true
    error.value = null

    try {
      await bookingAPI.delete(id)
      bookings.value = bookings.value.filter(booking => booking.id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    bookings,
    pagination,
    loading,
    error,
    fetchBookings,
    deleteBooking,
    getBooking,
    createBooking,
    updateBooking
  }
}
