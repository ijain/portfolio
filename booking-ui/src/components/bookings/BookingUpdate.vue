<template>
  <div>
    <h1>Update Booking</h1>

    <form v-if="booking" @submit.prevent="updateBooking" class="space-y-4">
      <div>
        <label class="block mb-1">Service</label>
        <select v-model="form.service_id">
          <option v-for="s in services" :key="s.id" :value="s.id">{{ s.name }}</option>
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

      <button
        type="submit"
        :disabled="loading"
      >
        {{ loading ? 'Updating...' : 'Update Booking' }}
      </button>
    </form>

    <div v-else-if="loading">Loading booking...</div>
    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BookingUpdate',
  data() {
    return {
      booking: null,
      services: [],
      form: {
        service_id: null,
        start_time: '',
        end_time: '',
        status: 'pending',
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchBooking() {
      this.loading = true;
      this.error = null;
      const id = this.$route.params.id;
      try {
        const token = localStorage.getItem('token');

        // Fetch booking
        const res = await axios.get(`http://localhost:8000/api/v1/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        this.booking = res.data;
        this.form.service_id = res.data.service.id;
        this.form.start_time = res.data.start_time.slice(0, 16);
        this.form.end_time = res.data.end_time.slice(0, 16);
        this.form.status = res.data.status;

        // Fetch services
        const servicesRes = await axios.get(`http://localhost:8000/api/v1/services`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        this.services = servicesRes.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
    async updateBooking() {
      this.loading = true;
      this.error = null;
      const id = this.$route.params.id;
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:8000/api/v1/bookings/${id}`, { ...this.form }, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        this.$router.push('/bookings');
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchBooking();
  },
};
</script>
