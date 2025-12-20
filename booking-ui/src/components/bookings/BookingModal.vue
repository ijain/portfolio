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
        <label class="block mb-1">Start Time</label>
        <input type="datetime-local" v-model="form.start_time" required />
      </div>
      <div>
        <label class="block mb-1">End Time</label>
        <input type="datetime-local" v-model="form.end_time" required />
      </div>
      <div v-if="booking">
        <label>Status</label>
        <select v-model="form.status" required>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
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
  start_time: '',
  end_time: '',
  status: 'pending',
  service_id: ''
})

const { services, fetchServices } = useServices()

// Fetch services on mount
onMounted(fetchServices)

// Prefill form when editing
watch(() => props.booking, (val) => {
  if (val) {
    form.start_time = val.start_time.slice(0,16)
    form.end_time = val.end_time.slice(0,16)
    form.status = val.status
    form.service_id = val.service?.id || ''
  } else {
    form.start_time = ''
    form.end_time = ''
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
