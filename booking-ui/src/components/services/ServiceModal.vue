<template>
  <BaseModal :visible="visible" @close="$emit('close')">
    <h2>{{ service ? 'Edit Service' : 'Add Service' }}</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label>Name</label>
        <input type="text" v-model="form.name" required />
      </div>
      <div>
        <label>Description</label>
        <textarea v-model="form.description"></textarea>
      </div>
      <button type="submit" :disabled="loading">{{ loading ? 'Saving...' : 'Save' }}</button>
    </form>
  </BaseModal>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import BaseModal from '@/components/modal/BaseModal.vue'

const props = defineProps({
  visible: Boolean,
  service: Object
})
const emit = defineEmits(['save','close'])

const loading = ref(false)
const form = reactive({ name:'', description:'' })

watch(() => props.service, (val)=>{
  if(val){ form.name=val.name; form.description=val.description }
  else { form.name=''; form.description='' }
}, { immediate:true })

const submitForm = async () => {
  loading.value = true
  try { emit('save', { ...form, id: props.service?.id }) }
  finally { loading.value = false }
}
</script>
