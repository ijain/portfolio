<template>
  <div>
    <h2>Update Booking</h2>
    <form v-if="booking" @submit.prevent="updateBookingHandler" class="space-y-4">
      <div>
        <label class="block mb-1">Service</label>
        <select v-model="form.service_id">
          <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
        </select>
      </div>
      <div>
        <label class="block mb-1">Start Time</label>
        <input type="datetime-local" v-model="form.start_time" />
      </div>
      <div>
        <label class="block mb-1">End Time</label>
        <input type="datetime-local" v-model="form.end_time" />
      </div>
      <div>
        <label class="block mb-1">Status</label>
        <select v-model="form.status">
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Updating...' : 'Update Booking' }}
      </button>
    </form>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import useBookings from '@/composables/useBookings'
  import useServices from '@/composables/useServices'

  const router = useRouter()
  const route = useRoute()

  const { getBooking, updateBooking } = useBookings()
  const { services, fetchServices } = useServices()

  const booking = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const form = ref({
    service_id: null,
    start_time: '',
    end_time: '',
    status: 'pending',
  })

  onMounted(async () => {
    loading.value = true
    error.value = null
    try {
      await fetchServices()

      const data = await getBooking(route.params.id)
      booking.value = data
      form.value.service_id = data.service.id
      form.value.start_time = data.start_time.slice(0, 16)
      form.value.end_time = data.end_time.slice(0, 16)
      form.value.status = data.status
    } catch (err) {
      error.value = err.message || 'Failed to load booking'
    } finally {
      loading.value = false
    }
  })

  const updateBookingHandler = async () => {
    loading.value = true
    error.value = null
    try {
      await updateBooking(route.params.id, form.value)
      router.push('/bookings')
    } catch (err) {
      error.value = err.message || 'Failed to update booking'
    } finally {
      loading.value = false
    }
  }
</script>
