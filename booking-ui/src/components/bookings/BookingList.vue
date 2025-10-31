<template>
  <div>
    <h1>Bookings</h1>
    <button @click="$router.push('/bookings/create')" class="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
      Create Booking
    </button>
    <div v-if="loading">Loading bookings...</div>
    <div v-else>
      <table class="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th class="border border-gray-300 px-2 py-1">ID</th>
            <th class="border border-gray-300 px-2 py-1">Service</th>
            <th class="border border-gray-300 px-2 py-1">User</th>
            <th class="border border-gray-300 px-2 py-1">Start Time</th>
            <th class="border border-gray-300 px-2 py-1">End Time</th>
            <th class="border border-gray-300 px-2 py-1">Status</th>
            <th class="border border-gray-300 px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking.id">
            <td class="border border-gray-300 px-2 py-1">{{ booking.id }}</td>
            <td class="border border-gray-300 px-2 py-1">{{ booking.service.name }}</td>
            <td class="border border-gray-300 px-2 py-1">{{ booking.user.name }}</td>
            <td class="border border-gray-300 px-2 py-1">{{ booking.start_time }}</td>
            <td class="border border-gray-300 px-2 py-1">{{ booking.end_time }}</td>
            <td class="border border-gray-300 px-2 py-1">{{ booking.status }}</td>
            <td class="border border-gray-300 px-2 py-1 space-x-2">
              <button @click="editBooking(booking.id)" class="px-2 py-1 bg-yellow-400 text-white rounded">Edit</button>
              <button @click="deleteBookingHandler(booking.id)" class="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

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
  },
  mounted() {
    this.fetchBookings()
  },
}
</script>

<style scoped>
table {
  border-spacing: 0;
  border: 1px solid #ccc;
}
th, td {
  padding: 8px;
  text-align: left;
}
button {
  cursor: pointer;
}
</style>
