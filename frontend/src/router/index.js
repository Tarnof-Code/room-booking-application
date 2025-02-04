import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import Login from '../views/LoginView.vue'
import RoomSearch from '../views/RoomSearch.vue'
import MyBookingsView from '../views/MyBookingsView.vue'
import RoomBookingView from '../views/RoomBookingView.vue'
import RoomManagementView from '../views/RoomManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/search',
      name: 'roomSearch',
      component: RoomSearch,
    },
    {
      path: '/user/bookings',
      name: 'userBookings',
      component: MyBookingsView,
    },
    {
      path: '/room/:id/booking',
      name: 'roomBooking',
      component: RoomBookingView,
    },
    {
      path: '/management/rooms',
      name: 'roomManagement',
      component: RoomManagementView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.user && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
