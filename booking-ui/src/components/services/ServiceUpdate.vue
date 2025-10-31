<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Update Service</h1>

    <form v-if="service" @submit.prevent="updateServiceHandler" class="space-y-4">
      <div>
        <label class="block mb-1">Name</label>
        <input v-model="form.name" required class="border rounded px-2 py-1 w-full" />
      </div>

      <div>
        <label class="block mb-1">Description</label>
        <textarea v-model="form.description" class="border rounded px-2 py-1 w-full"></textarea>
      </div>

      <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded" :disabled="loading">
        {{ loading ? 'Updating...' : 'Update Service' }}
      </button>
    </form>

    <div v-else-if="loading">Loading service...</div>
    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
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
