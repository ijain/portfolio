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
        <input type="text" ref="datePicker" placeholder="Select date" required />
      </div>
      <div>
        <label>Time</label>
        <input type="text" ref="timePicker" placeholder="Select time" required />
      </div>
      <div>
        <label>Duration</label>
        <input type="text" ref="durationPicker" placeholder="hh:mm" />
      </div>
      <div v-if="booking">
        <label>Status</label>
        <select v-model="form.status" required>
          <option v-for="status in statuses" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save' }}
      </button>
    </form>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, watch, onMounted, nextTick } from 'vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import useServices from '@/composables/useServices'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'

const props = defineProps({
  visible: Boolean,
  booking: Object
})
const emit = defineEmits(['save','close'])

const loading = ref(false)

const form = reactive({
  date: '',
  time: '00:00',
  duration_hours: 0,
  duration_minutes: 0,
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
for (let hour = 0; hour <= 24; hour++) hoursOptions.push(hour)

const minutesOptions = []
for (let minute = 0; minute <= 59; minute++) minutesOptions.push(minute)

/* ────────────────
   FLATPICKR
──────────────── */

const datePicker = ref(null)
const timePicker = ref(null)
const durationPicker = ref(null)

let datePickerInstance = null
let timePickerInstance = null
let durationPickerInstance = null

onMounted(fetchServices)

/* Modal-safe lifecycle */
watch(() => props.visible, async (isVisible) => {
  // DESTROY on close
  if (!isVisible) {
    datePickerInstance?.destroy()
    timePickerInstance?.destroy()
    durationPickerInstance?.destroy()
    datePickerInstance = null
    timePickerInstance = null
    durationPickerInstance = null
    return
  }

  // INIT on open
  await nextTick()

  datePickerInstance = flatpickr(datePicker.value, {
    dateFormat: 'Y-m-d',
    onChange: ([date]) => {
      if (date) {
        form.date = date.toISOString().slice(0, 10)
      }
    }
  })

  timePickerInstance = flatpickr(timePicker.value, {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time_24hr: true,
    onChange: (_, dateStr) => {
      form.time = dateStr
    }
  })

  durationPickerInstance = flatpickr(durationPicker.value, {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time_24hr: true,
    defaultHour: 0,
    defaultMinute: 0,
    onChange: (_, timeStr) => {
      if (!timeStr) return
      const [h, m] = timeStr.split(':').map(Number)
      form.duration_hours = h
      form.duration_minutes = m
    }
  })

  if (form.date) datePickerInstance.setDate(form.date, false)
  if (form.time) timePickerInstance.setDate(form.time, false)
  if (form.duration_hours || form.duration_minutes) {
    const hh = String(form.duration_hours).padStart(2, '0')
    const mm = String(form.duration_minutes).padStart(2, '0')
    durationPickerInstance.setDate(`${hh}:${mm}`, false)
  }
})

/* ────────────────
   WATCH BOOKING
──────────────── */

watch(() => props.booking, (val) => {
  if (val) {
    form.date = typeof val.date === 'string'
        ? val.date.slice(0, 10)
        : ''

    form.time = typeof val.time === 'string'
        ? val.time.slice(0, 5)
        : '00:00'

    form.duration_hours = val.duration_hours ?? 0
    form.duration_minutes = val.duration_minutes ?? 0
    form.status = val.status || 'pending'
    form.service_id = val.service?.id || ''

    datePickerInstance?.setDate(form.date, false)
    timePickerInstance?.setDate(form.time, false)
    const hh = String(form.duration_hours).padStart(2, '0')
    const mm = String(form.duration_minutes).padStart(2, '0')
    durationPickerInstance?.setDate(`${hh}:${mm}`, false)
  } else {
    form.date = ''
    form.time = '00:00'
    form.duration_hours = 0
    form.duration_minutes = 0
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
