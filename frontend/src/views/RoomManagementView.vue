<template>
  <v-container>
    <h2>Gestion des salles</h2>
    <v-btn color="green" @click="dialog = true"> Ajouter une salle </v-btn>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Ajouter une salle</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="room.name"
              label="Nom de la salle"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-textarea v-model="room.description" label="Description"></v-textarea>
            <v-text-field
              v-model.number="room.capacity"
              label="Capacité"
              type="number"
              :rules="[rules.required, rules.minCapacity]"
              required
            ></v-text-field>
            <v-text-field
              v-model="room.equipements"
              label="Équipements (séparés par des virgules)"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog = false">Annuler</v-btn>
          <v-btn color="green" dark @click="addRoom">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="3000" color="success" location="center">
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn color="white" text @click="snackbar = false">OK</v-btn>
      </template>
    </v-snackbar>
  </v-container>
  <RoomList />
</template>

<script setup>
import { ref } from 'vue'
import { useRoomStore } from '@/stores/roomStore'

import RoomList from '../components/RoomList.vue'

import axios from 'axios'

const roomStore = useRoomStore()

const rules = {
  required: (value) => !!value || 'Ce champ est obligatoire',
  minCapacity: (value) =>
    (value > 0 && Number.isInteger(value)) || 'La capacité doit être un nombre supérieur à zéro',
}

const dialog = ref(false)
const form = ref(null)
const snackbar = ref(false)
const snackbarMessage = ref('')
const room = ref({
  name: '',
  description: '',
  capacity: null,
  equipements: '',
})

const addRoom = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return
  const equipementsArray = room.value.equipements
    .split(',')
    .map((e) => e.trim())
    .filter((e) => e !== '')
    .map((e) => ({ name: e }))
  const newRoom = {
    name: room.value.name,
    description: room.value.description,
    capacity: room.value.capacity,
    equipements: equipementsArray,
  }
  try {
    await axios.post('http://localhost:5000/room', newRoom)
    await roomStore.getAllRooms()
    snackbarMessage.value = 'La salle ' + newRoom.name + ' a été crée avec succès.'
    snackbar.value = true
    dialog.value = false
    room.value = { name: '', description: '', capacity: null, equipements: '' }
  } catch (error) {
    console.error('Erreur lors de la création de la salle', error)
  }
}
</script>
