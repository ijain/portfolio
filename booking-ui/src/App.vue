<template>
  <!-- Show AppLayout everywhere except on the login page -->
  <AppLayout v-if="!isLoginPage" />
  <router-view v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
</script>

<style>
body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}
</style>
