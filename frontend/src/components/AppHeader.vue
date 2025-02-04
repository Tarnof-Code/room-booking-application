<template>
  <header v-if="userStore.user">
    <v-container class="header-container" fluid>
      <v-row class="align-center py-4">
        <v-col cols="6">
          <nav v-if="!userStore.isAdmin()">
            <RouterLink :to="'/search'" class="nav-link"> Réserver une salle </RouterLink>
            <RouterLink to="/user/bookings" class="nav-link"> Mes réservations</RouterLink>
          </nav>
        </v-col>
        <v-col cols="6" class="text-right">
          <strong
            >{{ userStore.user.firstName }}
            {{ !userStore.isAdmin() ? userStore.user.lastName : null }}</strong
          >
          <v-btn @click="logOut" color="red" class="ml-4">
            <v-icon right>mdi-logout</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useRoomStore } from '@/stores/roomStore'
import { useBookingStore } from '@/stores/bookingStore'

const router = useRouter()

const userStore = useUserStore()
const roomStore = useRoomStore()
const bookingStore = useBookingStore()

const logOut = () => {
  userStore.logOut()
  roomStore.resetRoomsList()
  roomStore.setCurrentRoom({})
  bookingStore.resetBookings()
  bookingStore.setCurrentBooking({})
  router.push({ name: 'login' })
}
</script>

<style scoped>
.header-container {
  height: 80px;
  box-shadow: 0px 4px 4px -2px rgba(0, 0, 0, 0.2);
}
</style>
