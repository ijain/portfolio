<template>
  <BaseModal :visible="visible" @close="$emit('close')">
    <h2>{{ booking ? 'Edit Booking' : 'Add Booking' }}</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label class="block mb-1">Service</label>
        <select v-model="form.service_id" required>
          <option disabled value="">Select service</option>
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>
      </div>
      <div>
        <label>Date</label>
        <input type="date" v-model="form.date" required />
      </div>
      <div>
        <label>Time</label>
        <input type="time" v-model="form.time" step="60" min="00:00" max="23:59"  required />
      </div>
      <div>
        <label>Duration Hours</label>
        <select v-model="form.duration_hours">
          <option v-for="hour in hoursOptions" :key="hour" :value="hour">
            {{ hour }}
          </option>
        </select>
      </div>
      <div>
        <label>Duration Minutes</label>
        <select v-model="form.duration_minutes">
          <option v-for="minute in minutesOptions" :key="minute" :value="minute">
            {{ minute }}
          </option>
        </select>
      </div>
      <div v-if="booking">
        <label>Status</label>
        <select v-model="form.status" required>
          <option v-for="status in statuses" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>
      <button type="submit" :disabled="loading">{{ loading ? 'Saving...' : 'Save' }}</button>
    </form>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import useServices from '@/composables/useServices'

const props = defineProps({
  visible: Boolean,
  booking: Object
})
const emit = defineEmits(['save','close'])

const loading = ref(false)
const form = reactive({
  date: '',
  time: '',
  duration_hours: '0',
  duration_minutes: '0',
  status: 'pending',
  service_id: ''
})

const { services, fetchServices } = useServices()

const statuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const hoursOptions = []
for (let hour = 0; hour <= 24; hour++) {
  hoursOptions.push(hour)
}

const minutesOptions = []
for (let minute = 0; minute <= 59; minute++) {
  minutesOptions.push(minute)
}

onMounted(fetchServices)

watch(() => props.booking, (val) => {
  if (val) {
    form.date = val.date.slice(0,16)
    form.time = val.time.slice(0,16)
    form.duration_hours = val.duration_hours
    form.duration_minutes = val.duration_minutes
    form.status = val.status
    form.service_id = val.service?.id || ''
  } else {
    form.date = ''
    form.time = ''
    form.duration_hours = '0'
    form.duration_minutes = '0'
    form.status = 'pending'
    form.service_id = ''
  }
}, { immediate: true })

const submitForm = async () => {
  loading.value = true
  try {
    emit('save', { ...form, id: props.booking?.id })
  } finally {
    loading.value = false
  }
}
</script>
