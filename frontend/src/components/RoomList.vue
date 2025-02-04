<template>
  <v-container>
    <v-row v-if="!userStore.isAdmin()">
      <v-col cols="12" md="3">
        <v-text-field
          v-model.number="numberOfPeopleInput"
          label="Nombre de personnes"
          type="number"
          min="0"
          clearable
          :error-messages="numberOfPeopleError"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="equipementInput"
          label="Filtrer par équipement (facultatif)"
          placeholder="TV, Rétro Projecteur, etc."
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="filteredRooms"
      no-data-text="Aucune salle ne correspond à votre recherche"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.capacity }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.equipements.map((e) => e.name).join(', ') || 'Aucun' }}</td>
          <td>
            <v-btn
              @click="userStore.isAdmin() ? confirmDeleteRoom(item) : bookingRoom(item)"
              :color="userStore.isAdmin() ? 'white' : 'primary'"
              size="small"
            >
              <v-icon :color="userStore.isAdmin() ? 'red' : undefined">
                {{ userStore.isAdmin() ? 'mdi-delete' : 'mdi-calendar-check' }}
              </v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <template v-if="userStore.isAdmin()">
      <v-dialog v-model="dialogConfirm" max-width="400px">
        <v-card>
          <v-card-title>Confirmation</v-card-title>
          <v-card-text>
            Êtes-vous sûr de vouloir supprimer la salle <strong>{{ roomToDelete?.name }}</strong> ?
          </v-card-text>
          <v-card-actions>
            <v-btn color="grey" @click="dialogConfirm = false">Annuler</v-btn>
            <v-btn color="red" @click="deleteRoom">Supprimer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar" :timeout="3000" color="success" location="center">
        {{ snackbarMessage }}
        <template v-slot:actions>
          <v-btn color="white" text @click="snackbar = false">OK</v-btn>
        </template>
      </v-snackbar>
    </template>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomStore } from '@/stores/roomStore'
import { useBookingStore } from '@/stores/bookingStore'
import { useUserStore } from '@/stores/userStore'
import axios from 'axios'

const router = useRouter()

const roomStore = useRoomStore()
const bookingStore = useBookingStore()
const userStore = useUserStore()

const headers = ref([
  { title: 'Nom de la salle', key: 'name' },
  { title: 'Capacité', key: 'capacity' },
  { title: 'Description', key: 'description' },
  { title: 'Equipements', key: 'equipements' },
  { title: userStore.isAdmin() ? 'Supprimer' : 'Réserver', key: 'actions' },
])

const dialogConfirm = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const roomToDelete = ref(null)
const numberOfPeopleInput = ref(0)
const equipementInput = ref('')
const numberOfPeopleError = ref('')

const filteredRooms = computed(() => {
  return roomStore.rooms.filter((room) => {
    const capacityFilter = numberOfPeopleInput.value
      ? room.capacity >= numberOfPeopleInput.value
      : true
    const equipementFilter = equipementInput.value
      ? room.equipements.some((e) =>
          e.name.toLowerCase().includes(equipementInput.value.toLowerCase()),
        )
      : true
    return capacityFilter && equipementFilter
  })
})

const loadNumberOfPeople = () => {
  if (bookingStore.currentBooking) {
    numberOfPeopleInput.value = bookingStore.currentBooking.numberOfPeople || 0
  }
}

const bookingRoom = (item) => {
  let currentBooking = bookingStore.currentBooking
  const today = new Date().toISOString().split('T')[0]
  const startTime = currentBooking.startTime
  const endTime = currentBooking.endTime
  const date = currentBooking.date
  if (!date || date < today || !startTime || !endTime || endTime <= startTime) {
    return
  }
  if (numberOfPeopleInput.value <= 0) {
    numberOfPeopleError.value = 'Le nombre de personnes doit être supérieur à zéro.'
    return
  }
  numberOfPeopleError.value = ''
  currentBooking.room = item._id
  currentBooking.numberOfPeople = numberOfPeopleInput.value
  bookingStore.setCurrentBooking(currentBooking)
  roomStore.setCurrentRoom(item)
  router.push({ name: 'roomBooking', params: { id: item._id } })
}

const confirmDeleteRoom = (room) => {
  roomToDelete.value = room
  dialogConfirm.value = true
}

const deleteRoom = async () => {
  if (!roomToDelete.value) return
  try {
    await axios.delete(`http://localhost:5000/room/${roomToDelete.value._id}`)
    snackbarMessage.value = `Salle "${roomToDelete.value.name}" supprimée avec succès !`
    snackbar.value = true
    await roomStore.getAllRooms()
  } catch (error) {
    console.error('Erreur lors de la suppression de la salle.', error)
  }
  dialogConfirm.value = false
}

onMounted(loadNumberOfPeople)
</script>
