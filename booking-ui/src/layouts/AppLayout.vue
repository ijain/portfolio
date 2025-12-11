<template>
  <div class="wrapper">
    <header>
      <h3>Booking Anything</h3>
    </header>

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

    <main>
      <RouterView />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Praesent vitae orci nec lorem dictum facilisis.
        Integer scelerisque nisl sit amet neque fermentum,
        non pulvinar arcu consequat. Donec sed erat id urna varius blandit.
        Mauris posuere gravida lorem, vel malesuada sapien ultricies nec.
      </p>
    </main>

    <footer>Lorem ipsum dolor sit amet, consectetur adipiscing elit</footer>
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
