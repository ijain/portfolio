<template>
  <div class="top-row">
    <h2>Services</h2>
    <button @click="openAddModal">Add Service</button>
  </div>

  <div v-if="loading">Loading services...</div>

  <div v-else class="grid-table">
    <div class="headers">
      <div class="counter-column">#</div>
      <div>Name</div>
      <div>Description</div>
      <div>Actions</div>
    </div>

    <template v-for="(service, index) in services" :key="service.id">
      <div class="rows">
        <div class="counter-column">{{ (pagination.currentPage - 1) * pagination.perPage + index + 1 }}.</div>
        <div>{{ service.name }}</div>
        <div>{{ service.description }}</div>
        <div>
          <button @click="openEditModal(service)">Edit</button>
          <button @click="deleteServiceHandler(service.id)">Delete</button>
        </div>
      </div>
    </template>

    <div v-if="pagination.lastPage > 1" class="pagination">
      <button :disabled="pagination.currentPage === 1"
              @click="goToPage(pagination.currentPage - 1)">Prev</button>

      <button v-for="page in pagination.lastPage" :key="page"
              :class="{ active: page === pagination.currentPage }" @click="goToPage(page)">{{ page }}</button>

      <button :disabled="pagination.currentPage === pagination.lastPage"
              @click="goToPage(pagination.currentPage + 1)">Next</button>
    </div>
  </div>

  <ServiceModal
      :visible="isModalOpen"
      :service="selectedService"
      @save="handleSave"
      @close="closeModal"
  />
</template>

<script setup>
import {onMounted, ref} from 'vue'
import useServices from '@/composables/useServices'
import ServiceModal from '@/components/services/ServiceModal.vue'
import { useRouter } from 'vue-router'
import '@/assets/styles/table.css'
import '@/assets/styles/pagination.css'
import BookingModal from "@/components/bookings/BookingModal.vue";

const isModalOpen = ref(false)
const selectedService = ref(null)
const currentPage = ref(1)
const { services, pagination, loading, error, fetchServices, deleteService,
  createService, updateService } = useServices()

onMounted(() => fetchServices(currentPage.value))

const goToPage = (page) => {
  if (page < 1 || page > pagination.value.lastPage) return
  currentPage.value = page
  fetchServices(page)
}

const openEditModal = (service) => {
  selectedService.value = { ...service } // shallow copy
  isModalOpen.value = true
}

const openAddModal = () => {
  selectedService.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedService.value = null
}

const handleSave = async (formData) => {
  if (formData.id) {
    await updateService(formData.id, formData)
  } else {
    await createService(formData)
  }
  fetchServices()
  closeModal()
}

const deleteServiceHandler = async (id) => {
  if (confirm('Are you sure you want to delete this service?')) {
    await deleteService(id)
  }
}
</script>
