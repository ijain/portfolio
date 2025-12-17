<template>
  <div class="top-row">
    <h2>Bookings</h2>
    <button @click="addBooking">Add Booking</button>
  </div>

  <div v-if="loading">Loading bookings...</div>
  <div v-else class="grid-table">
    <div class="headers">
      <div>ID</div>
      <div>Service</div>
      <div>User</div>
      <div>Start Time</div>
      <div>End Time</div>
      <div>Status</div>
      <div>Actions</div>
    </div>
    <template v-for="booking in bookings" :key="booking.id">
      <div class="rows">
        <div>{{ booking.id }}</div>
        <div>{{ booking.service.name }}</div>
        <div>{{ booking.user.name }}</div>
        <div>{{ new Date(booking.start_time).toLocaleString() }}</div>
        <div>{{ new Date(booking.end_time).toLocaleString() }}</div>
        <div>{{ booking.status }}</div>
        <div>
          <button @click="editBooking(booking.id)">Edit</button>
          <button @click="deleteBookingHandler(booking.id)">Delete</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import '@/assets/styles/table.css'

export default {
  name: 'BookingList',
  data() {
    return {
      bookings: [],
      loading: false,
      error: null,
    }
  },
  methods: {
    async fetchBookings() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8000/api/v1/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        this.bookings = response.data.data
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    editBooking(id) {
      this.$router.push(`/bookings/update/${id}`)
    },
    async deleteBookingHandler(id) {
      if (!confirm('Are you sure you want to delete this booking?')) return
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:8000/api/v1/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        this.fetchBookings()
      } catch (err) {
        console.error(err)
        alert('Failed to delete booking')
      }
    },
    addBooking() {
      this.$router.push('/bookings/create')
    }
  },
  mounted() {
    this.fetchBookings()
  },
}
</script>

