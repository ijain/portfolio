<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Services</h1>

    <button
      @click="$router.push('/services/create')"
      class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      + Create Service
    </button>

    <div v-if="loading">Loading services...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <table
      v-if="!loading && services.length"
      class="table-auto border-collapse border border-gray-300 w-full"
    >
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-3 py-2 text-left">ID</th>
          <th class="border border-gray-300 px-3 py-2 text-left">Name</th>
          <th class="border border-gray-300 px-3 py-2 text-left">Description</th>
          <th class="border border-gray-300 px-3 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="service in services" :key="service.id">
          <td class="border border-gray-300 px-3 py-2">{{ service.id }}</td>
          <td class="border border-gray-300 px-3 py-2">{{ service.name }}</td>
          <td class="border border-gray-300 px-3 py-2">{{ service.description }}</td>
          <td class="border border-gray-300 px-3 py-2 space-x-2">
            <button
              @click="editService(service.id)"
              class="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
            >
              Edit
            </button>
            <button
              @click="deleteServiceHandler(service.id)"
              class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading && !services.length" class="text-gray-500">No services found.</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import useServices from '@/composables/useServices'
import { useRouter } from 'vue-router'

const router = useRouter()
const { services, loading, error, fetchServices, deleteService } = useServices()

onMounted(fetchServices)

const editService = (id) => router.push(`/services/update/${id}`)

const deleteServiceHandler = async (id) => {
  if (confirm('Are you sure you want to delete this service?')) {
    await deleteService(id)
  }
}
</script>
