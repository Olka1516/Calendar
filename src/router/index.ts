import { createRouter, createWebHistory } from 'vue-router'
import CalendarPage from '../views/CalendarPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CalendarPage
    },
  ]
})

export default router
