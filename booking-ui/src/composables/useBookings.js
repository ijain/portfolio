import { ref } from 'vue'
import { bookingAPI } from '@/helpers/api'

export default function useBookings() {
  const bookings = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchBookings = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await bookingAPI.getAll()
      bookings.value = res.data.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error(err)
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
      await fetchBookings()
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
      await fetchBookings()
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
      bookings.value = bookings.value.filter(b => b.id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    deleteBooking,
    getBooking,
    createBooking,
    updateBooking
  }
}
