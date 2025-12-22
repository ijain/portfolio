import { createRouter, createWebHistory } from 'vue-router'
import BookingList from '@/components/bookings/BookingList.vue'
import ServiceList from '@/components/services/ServiceList.vue'
import Login from '@/components/auth/Login.vue'

const routes = [
  { path: '/', redirect: '/bookings' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/bookings', name: 'BookingList', component: BookingList },
  { path: '/services', name: 'ServiceList', component: ServiceList }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const token = localStorage.getItem('token')

  if (authRequired && !token) {
    return next('/login')
  }
  if (to.path === '/login' && token) {
    return next('/bookings')
  }
  next()
})

export default router
