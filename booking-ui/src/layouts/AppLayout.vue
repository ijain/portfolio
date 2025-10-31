<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 text-white flex flex-col">
      <div class="p-4 text-2xl font-bold border-b border-gray-700">
        MyApp
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <RouterLink
          to="/services"
          class="block px-3 py-2 rounded hover:bg-gray-700"
          :class="{ 'bg-gray-700': isActive('/services') }"
        >
          Services
        </RouterLink>

        <RouterLink
          to="/bookings"
          class="block px-3 py-2 rounded hover:bg-gray-700"
          :class="{ 'bg-gray-700': isActive('/bookings') }"
        >
          Bookings
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-gray-700">
        <button
          v-if="isLoggedIn"
          @click="logout"
          class="w-full text-left px-3 py-2 rounded bg-red-500 hover:bg-red-600"
        >
          Logout
        </button>

        <RouterLink
          v-else
          to="/login"
          class="block px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-center"
        >
          Login
        </RouterLink>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const isLoggedIn = computed(() => !!localStorage.getItem('token'))

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const isActive = (path) => route.path.startsWith(path)
</script>
