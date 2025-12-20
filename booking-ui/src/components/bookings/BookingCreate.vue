<template>
  <div>
    <h1>Create Booking</h1>
    <form @submit.prevent="submitBookingHandler" class="space-y-4">
      <div>
        <label class="block mb-1">Service</label>
        <select v-model="form.service_id">
          <option disabled value="">Select service</option>
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
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
      <button type="submit" :disabled="loading">
        {{ loading ? 'Creating...' : 'Create Booking' }}
      </button>
    </form>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import useBookings from '@/composables/useBookings'
  import useServices from '@/composables/useServices'

  const router = useRouter()

  const { createBooking, loading: bookingsLoading, error: bookingsError } = useBookings()
  const { services, fetchServices, loading: servicesLoading, error: servicesError } = useServices()

  const form = ref({
    service_id: '',
    start_time: '',
    end_time: '',
  })
  const loading = ref(false)
  const error = ref(null)

  onMounted(async () => {
    loading.value = true
    error.value = null
    try {
      await fetchServices()
    } catch (err) {
      error.value = err.message || 'Failed to fetch services'
    } finally {
      loading.value = false
    }
  })

  const submitBookingHandler = async () => {
    loading.value = true
    error.value = null
    try {
      await createBooking(form.value)
      router.push('/bookings')
    } catch (err) {
      error.value = err.message || 'Failed to create booking'
    } finally {
      loading.value = false
    }
  }
</script>
