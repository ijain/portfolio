import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1/bookings'

export default function useBookings() {
  const bookings = ref([])

  const fetchBookings = async () => {
    const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    bookings.value = res.data
  }

  const getBooking = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    return res.data
  }

  const createBooking = async (data) => {
    await axios.post(API_URL, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
  }

  const updateBooking = async (id, data) => {
    await axios.put(`${API_URL}/${id}`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
  }

  const deleteBooking = async (id) => {
    await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    bookings.value = bookings.value.filter(b => b.id !== id)
  }

  return { bookings, fetchBookings, getBooking, createBooking, updateBooking, deleteBooking }
}
