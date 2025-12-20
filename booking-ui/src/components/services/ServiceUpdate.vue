<template>
  <div>
    <h2>Update Service</h2>
    <form v-if="service" @submit.prevent="updateService" class="space-y-4">
      <div>
        <label class="block mb-1">Name</label>
        <input v-model="form.name" required />
      </div>
      <div>
        <label class="block mb-1">Description</label>
        <textarea v-model="form.description"></textarea>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Updating...' : 'Update Service' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useServices from '@/composables/useServices'

const route = useRoute()
const router = useRouter()
const { getService, updateService, loading, error } = useServices()

const service = ref(null)
const form = reactive({ name: '', description: '' })

const fetchService = async () => {
  try {
    service.value = await getService(route.params.id)
    Object.assign(form, service.value)
  } catch (err) {
    console.error(err)
  }
}

const updateServiceHandler = async () => {
  try {
    await updateService(route.params.id, form)
    router.push('/services')
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchService)
</script>
