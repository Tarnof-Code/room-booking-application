<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="ma-3">
          <v-card-title class="headline">{{ roomStore.currentRoom.name }}</v-card-title>
          <v-card-subtitle>{{
            roomStore.currentRoom.description || 'Aucune description disponible'
          }}</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" lg="4">
                <v-chip class="pa-6" color="primary" text-color="white"
                  >Capacité: {{ roomStore.currentRoom.capacity }}</v-chip
                >
              </v-col>
              <v-col cols="12" lg="8">
                <v-chip class="pa-6" color="secondary" text-color="white"
                  >Équipements:
                  {{
                    roomStore.currentRoom.equipements?.map((e) => e.name).join(', ') || 'Aucun'
                  }}</v-chip
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-form @submit.prevent="confirmBooking">
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field v-model="formData.date" label="Date" type="date" readonly required />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="formData.startTime"
            label="Heure de début"
            type="time"
            readonly
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="formData.endTime"
            label="Heure de fin"
            type="time"
            readonly
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model.number="formData.numberOfPeople"
            label="Nombre de personnes"
            type="number"
            min="0"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="auto">
          <v-btn type="submit" color="primary">Réserver</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="cancelBooking" color="red">Annuler</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-dialog v-model="successDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h5">Réservation Confirmée</v-card-title>
        <v-card-text class="text-center">
          <v-icon color="success" size="48">mdi-check-circle</v-icon>
          <p>Votre réservation a été effectuée avec succès.</p>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="goToMyBookings">Voir mes réservations</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/bookingStore'
import { useRoomStore } from '@/stores/roomStore'
import { useUserStore } from '@/stores/userStore'

import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const router = useRouter()
const bookingStore = useBookingStore()
const roomStore = useRoomStore()
const userStore = useUserStore()

const formData = ref({
  date: '',
  startTime: '',
  endTime: '',
  numberOfPeople: 0,
  firstName: '',
  lastName: '',
})

const successDialog = ref(false)

const loadBookingData = async () => {
  if (!bookingStore.currentBooking) return
  const {
    date = '',
    startTime = '',
    endTime = '',
    numberOfPeople = 0,
  } = bookingStore.currentBooking
  formData.value = {
    date,
    startTime,
    endTime,
    numberOfPeople,
    room: roomStore.currentRoom._id || '',
  }
}

const confirmBooking = async () => {
  let booking = { ...formData.value }
  booking.firstName = userStore.user.firstName
  booking.lastName = userStore.user.lastName
  booking.startTime = dayjs
    .utc(`${booking.date} ${booking.startTime}`, 'YYYY-MM-DD HH:mm')
    .toISOString()
  booking.endTime = dayjs
    .utc(`${booking.date} ${booking.endTime}`, 'YYYY-MM-DD HH:mm')
    .toISOString()
  booking.date = dayjs.utc(booking.date, 'YYYY-MM-DD').toISOString()
  try {
    await axios.post('http://localhost:5000/booking', booking)
    roomStore.setCurrentRoom({})
    roomStore.resetRoomsList()
    bookingStore.setCurrentBooking({})
    successDialog.value = true
  } catch (error) {
    console.error('Erreur lors de la réservation:', error)
  }
}

const cancelBooking = () => {
  router.push({ name: 'roomSearch' })
}

const goToMyBookings = () => {
  successDialog.value = false
  router.push({ name: 'userBookings' })
}

onMounted(() => {
  loadBookingData()
})
</script>
