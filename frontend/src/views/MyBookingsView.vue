<template>
  <div>
    <h2>Liste de mes réservations</h2>
    <v-data-table
      :headers="headers"
      :items="bookingStore.bookings"
      no-data-text="Aucune réservation"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ dayjs.utc(item.date).format('DD/MM/YYYY') }}</td>
          <td>{{ item.room.name }}</td>
          <td>{{ dayjs.utc(item.startTime).format('HH:mm') }}</td>
          <td>{{ dayjs.utc(item.endTime).format('HH:mm') }}</td>
          <td>{{ item.numberOfPeople }}</td>
          <td>
            <v-btn @click="openDeleteDialog(item._id)" color="white" size="small">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmer la suppression</v-card-title>
        <v-card-text> Êtes-vous sûr de vouloir supprimer cette réservation ? </v-card-text>
        <v-card-actions>
          <v-btn @click="cancelDelete" color="grey" text>Annuler</v-btn>
          <v-btn @click="deleteBooking" color="red" text>Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="3000" color="success" location="center">
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn color="white" text @click="snackbar = false">OK</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useBookingStore } from '@/stores/bookingStore'
import { useUserStore } from '@/stores/userStore'

import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const bookingStore = useBookingStore()
const userStore = useUserStore()

const headers = ref([
  { title: 'Date', key: 'date' },
  { title: 'Salle', key: 'room' },
  { title: 'Heure de début', key: 'startTime' },
  { title: 'Heure de fin', key: 'endTime' },
  { title: 'Nombre de participants', key: 'numberOfPeople' },
  { title: 'Supprimer', key: 'actions' },
])

const dialogVisible = ref(false)
const bookingToDelete = ref(null)
const snackbar = ref(false)
const snackbarMessage = ref('')

const openDeleteDialog = (bookingId) => {
  bookingToDelete.value = bookingId
  dialogVisible.value = true
}

const deleteBooking = async () => {
  try {
    if (bookingToDelete.value) {
      await axios.delete('http://localhost:5000/booking/' + bookingToDelete.value)
      bookingStore.bookings = bookingStore.bookings.filter(
        (booking) => booking._id !== bookingToDelete.value,
      )
      dialogVisible.value = false
      bookingToDelete.value = null
      snackbarMessage.value = 'Réservation supprimée avec succès'
      snackbar.value = true
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error)
    dialogVisible.value = false
  }
}

const cancelDelete = () => {
  dialogVisible.value = false
  bookingToDelete.value = null
}

onMounted(() => {
  bookingStore.getBookingsByUser(userStore.user.firstName, userStore.user.lastName)
})
</script>
