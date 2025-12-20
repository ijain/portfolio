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

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useBookings from '@/composables/useBookings'
import '@/assets/styles/table.css'

const router = useRouter()
const { bookings, loading, error, fetchBookings, deleteBooking } = useBookings()

onMounted(fetchBookings)

const addBooking = () => router.push('/bookings/create')
const editBooking = (id) => router.push(`/bookings/update/${id}`)

const deleteBookingHandler = async (id) => {
  if (confirm('Are you sure you want to delete this booking?')) {
    try {
      await deleteBooking(id)
    } catch {
      alert('Failed to delete booking')
    }
  }
}
</script>
