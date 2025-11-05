<template>
  <div>
    <h1>Create Booking</h1>

    <form @submit.prevent="submitBooking" class="space-y-4">
      <div>
        <label class="block mb-1">Service</label>
        <select v-model="form.service_id" class="border rounded px-2 py-1 w-full">
          <option disabled value="">Select service</option>
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-1">Start Time</label>
        <input type="datetime-local" v-model="form.start_time" class="border rounded px-2 py-1 w-full" />
      </div>

      <div>
        <label class="block mb-1">End Time</label>
        <input type="datetime-local" v-model="form.end_time" class="border rounded px-2 py-1 w-full" />
      </div>

      <button
        type="submit"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        :disabled="loading"
      >
        {{ loading ? 'Creating...' : 'Create Booking' }}
      </button>
    </form>

    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BookingCreate',
  data() {
    return {
      services: [],
      form: {
        service_id: '',
        start_time: '',
        end_time: '',
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchServices() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/v1/services', {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        this.services = res.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      }
    },
    async submitBooking() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          'http://localhost:8000/api/v1/bookings',
          { ...this.form },
          { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
        );
        this.$router.push('/bookings');
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchServices();
  },
};
</script>

