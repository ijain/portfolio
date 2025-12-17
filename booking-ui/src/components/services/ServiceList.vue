<template>
  <div class="top-row">
    <h2>Services</h2>
    <button @click="addService">Add Service</button>
  </div>

  <div v-if="loading">Loading services...</div>
  <div v-else class="grid-table">
    <div class="headers">
      <div>ID</div>
      <div>Name</div>
      <div>Description</div>
      <div>Actions</div>
    </div>
    <template v-for="service in services" :key="service.id">
      <div class="rows">
        <div>{{ service.id }}</div>
        <div>{{ service.name }}</div>
        <div>{{ service.description }}</div>
        <div>
          <button @click="editService(service.id)">Edit</button>
          <button @click="deleteServiceHandler(service.id)">Delete</button>
        </div>
      </div>
  </template>
 </div>
</template>

<script setup>
import { onMounted } from 'vue'
import useServices from '@/composables/useServices'
import { useRouter } from 'vue-router'
import '@/assets/styles/table.css'

const router = useRouter()
const { services, loading, error, fetchServices, deleteService } = useServices()

onMounted(fetchServices)

const editService = (id) => router.push(`/services/update/${id}`)
const addService = () => router.push(`/services/create`)

const deleteServiceHandler = async (id) => {
  if (confirm('Are you sure you want to delete this service?')) {
    await deleteService(id)
  }
}
</script>
