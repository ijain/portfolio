<template>
  <div class="wrapper">
    <header>
      <div class="title">
        <h3>Book Anything</h3>
        <img src="/logo.png" class="logo" alt="Logo" />
      </div>

      <nav>
        <RouterLink
            to="/services"
            :class="{ active: isActive('/services') }"
        >
          Services
        </RouterLink>

        <RouterLink
            to="/bookings"
            :class="{ active: isActive('/bookings') }"
        >
          Bookings
        </RouterLink>

        <button v-if="isLoggedIn" @click="logout">Logout</button>

        <RouterLink v-else to="/login">Login</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
        <small>© 2025 Irina Sharga. Demo project, all media used for illustration only.</small>
    </footer>
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
