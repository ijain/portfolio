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

  const deleteBooking = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return
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
  }
}
