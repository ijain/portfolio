import { createRouter, createWebHistory } from 'vue-router'

// Bookings
import BookingList from '@/components/bookings/BookingList.vue'
import BookingCreate from '@/components/bookings/BookingCreate.vue'
import BookingUpdate from '@/components/bookings/BookingUpdate.vue'

// Services
import ServiceList from '@/components/services/ServiceList.vue'
import ServiceCreate from '@/components/services/ServiceCreate.vue'
import ServiceUpdate from '@/components/services/ServiceUpdate.vue'

// Auth
import Login from '@/components/auth/Login.vue'

const routes = [
  { path: '/', redirect: '/bookings' },
  { path: '/login', name: 'Login', component: Login },

  // Bookings
  { path: '/bookings', name: 'BookingList', component: BookingList },
  { path: '/bookings/create', name: 'BookingCreate', component: BookingCreate },
  { path: '/bookings/update/:id', name: 'BookingUpdate', component: BookingUpdate, props: true },

  // Services
  { path: '/services', name: 'ServiceList', component: ServiceList },
  { path: '/services/create', name: 'ServiceCreate', component: ServiceCreate },
  { path: '/services/update/:id', name: 'ServiceUpdate', component: ServiceUpdate, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const token = localStorage.getItem('token')

  // If NOT logged in and trying to access protected page → redirect to login
  if (authRequired && !token) {
    return next('/login')
  }

  // If logged in and trying to access /login → redirect to bookings
  if (to.path === '/login' && token) {
    return next('/bookings')
  }

  next()
})

// ✅ Then export router (AFTER guard)
export default router
