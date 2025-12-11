<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Create Service</h1>

    <form @submit.prevent="createServiceHandler" class="space-y-4">
      <div>
        <label class="block mb-1">Name</label>
        <input v-model="form.name" required />
      </div>

      <div>
        <label class="block mb-1">Description</label>
        <textarea v-model="form.description"></textarea>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Creating...' : 'Create Service' }}
      </button>
    </form>

    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import useServices from '@/composables/useServices'

const router = useRouter()
const { createService, loading, error } = useServices()

const form = reactive({
  name: '',
  description: ''
})

const createServiceHandler = async () => {
  try {
    await createService(form)
    router.push('/services')
  } catch (err) {
    console.error(err)
  }
}
</script>
