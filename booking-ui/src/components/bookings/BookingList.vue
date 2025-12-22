<template>
  <div class="top-row">
    <h2>Bookings</h2>
    <button @click="openAddModal">Add Booking</button>
  </div>

  <div v-if="loading">Loading bookings...</div>

  <div v-else class="grid-table">
    <div class="headers">
      <div class="counter-column">#</div>
      <div>Service</div>
      <div>Date</div>
      <div>Time</div>
      <div>Status</div>
      <div>Actions</div>
    </div>

    <template v-for="(booking, index) in bookings" :key="booking.id">
      <div class="rows">
        <div class="counter-column">{{ (pagination.currentPage - 1) * pagination.perPage + index + 1 }}.</div>
        <div>{{ booking.service.name }}</div>
        <div>{{ formatDate(booking.date) }}</div>
        <div>{{ formatTime(booking.date, booking.time) }}</div>
        <div>{{ booking.status }}</div>
        <div>
          <button @click="openEditModal(booking)">Edit</button>
          <button @click="deleteBookingHandler(booking.id)">Delete</button>
        </div>
      </div>
    </template>

    <div v-if="pagination.lastPage > 1" class="pagination">
      <button :disabled="pagination.currentPage === 1"
              @click="goToPage(pagination.currentPage - 1)">Prev</button>

      <button v-for="page in pagination.lastPage" :key="page"
              :class="{ active: page === pagination.currentPage }" @click="goToPage(page)">{{ page }}</button>

      <button :disabled="pagination.currentPage === pagination.lastPage"
              @click="goToPage(pagination.currentPage + 1)">Next</button>
    </div>
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
import useBookings from '@/composables/useBookings'
import BookingModal from '@/components/bookings/BookingModal.vue'
import '@/assets/styles/table.css'
import '@/assets/styles/pagination.css'

const isModalOpen = ref(false)
const selectedBooking = ref(null)
const currentPage = ref(1)
const { bookings, pagination, loading, error, fetchBookings, deleteBooking,
  createBooking, updateBooking } = useBookings()

onMounted(() => fetchBookings(currentPage.value))

const goToPage = (page) => {
  if (page < 1 || page > pagination.value.lastPage) return
  currentPage.value = page
  fetchBookings(page)
}

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })

const formatTime = (dateString, timeString) =>
    new Date(dateString + 'T' + timeString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

const openEditModal = (booking) => {
  selectedBooking.value = { ...booking } // shallow copy
  isModalOpen.value = true
}

const openAddModal = () => {
  selectedBooking.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedBooking.value = null
}

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
