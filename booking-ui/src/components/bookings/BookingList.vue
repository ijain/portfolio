<template>
  <div class="top-row">
    <h2>Bookings</h2>
    <button @click="openAddModal">Add Booking</button>
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
          <button @click="openEditModal(booking)">Edit</button>
          <button @click="deleteBookingHandler(booking.id)">Delete</button>
        </div>
      </div>
    </template>

  </div>

  <BookingModal
      :visible="isModalOpen"
      :booking="selectedBooking"
      @save="handleSave"
      @close="closeModal"
  />

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useBookings from '@/composables/useBookings'
import BookingModal from '@/components/bookings/BookingModal.vue'
import '@/assets/styles/table.css'

const isModalOpen = ref(false)
const selectedBooking = ref(null)

const router = useRouter()
const { bookings, loading, error, fetchBookings, deleteBooking, createBooking, updateBooking } = useBookings()

onMounted(fetchBookings)

const openEditModal = (booking) => {
  selectedBooking.value = { ...booking } // shallow copy
  isModalOpen.value = true
}

const openAddModal = () => {
  selectedBooking.value = null
  isModalOpen.value = true
}

// Close modal
const closeModal = () => {
  isModalOpen.value = false
  selectedBooking.value = null
}

// Handle save from modal (Add or Edit)
const handleSave = async (formData) => {
  if (formData.id) {
    await updateBooking(formData.id, formData)
  } else {
    await createBooking(formData)
  }
  fetchBookings()
  closeModal()
}

const deleteBookingHandler = async (id) => {
  if (confirm('Are you sure you want to delete this booking?')) {
    await deleteBooking(id)
  }
}
</script>
