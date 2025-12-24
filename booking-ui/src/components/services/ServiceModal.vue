<template>
  <BaseModal :visible="visible" @close="$emit('close')">
    <h2>{{ service ? 'Edit Service' : 'Add Service' }}</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label>Name</label>
        <input type="text" v-model="form.name" @input="errors.name = ''" />
        <p v-if="errors.name" class="error">
          {{ errors.name }}
        </p>
      </div>
      <div>
        <label>Description</label>
        <textarea v-model="form.description" @input="errors.description = ''" ></textarea>
        <p v-if="errors.description" class="error">
          {{ errors.description }}
        </p>
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
const errors = reactive({ name: '', description: '' })

watch(() => props.service, (val) => {
  if (val) {
    form.name=val.name;
    form.description=val.description
  } else {
    form.name='';
    form.description=''
  }
  Object.keys(errors).forEach(key => errors[key] = '')
}, { immediate:true })

const validate = () => {
  let valid = true
  errors.name = ''
  errors.description = ''

  if (!form.name.trim()) {
    errors.name = 'Name is required'
    valid = false
  } else if (form.name.length > 60) {
    errors.name = 'Name must be at most 60 characters'
    valid = false
  }

  if (!form.description.trim()) {
    errors.description = 'Description is required'
    valid = false
  } else if (form.description.length > 255) {
    errors.description = 'Description must be at most 255 characters'
    valid = false
  }

  return valid
}

const submitForm = async () => {
  if (!validate()) {
    return
  }
  loading.value = true

  try {
    emit('save', { ...form, id: props.service?.id })
  }
  finally {
    loading.value = false
  }
}
</script>
