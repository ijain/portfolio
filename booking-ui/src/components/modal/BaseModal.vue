<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal">
      <slot />
      <button class="modal-close" @click="close">✕</button>
    </div>
  </div>
</template>

<script setup>
import '@/assets/styles/modal.css'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['close'])

const close = () => emit('close')
</script>
