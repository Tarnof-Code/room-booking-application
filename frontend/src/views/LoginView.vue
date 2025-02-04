<template>
  <h2>Réservations de salles</h2>
  <v-container class="d-flex justify-center">
    <v-card class="pa-5" width="500">
      <v-card-title class="text-center text-h5">Connexion</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="firstName"
            label="Prénom"
            clearable
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            v-model="lastName"
            label="Nom"
            clearable
            :rules="[rules.required]"
          ></v-text-field>
          <v-btn type="submit" color="primary" block :disabled="!firstName || !lastName">
            Se connecter
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useRoomStore } from '@/stores/roomStore'

const router = useRouter()
const userStore = useUserStore()
const roomStore = useRoomStore()

const rules = {
  required: (value) => !!value || 'Ce champ est obligatoire',
}

const firstName = ref('')
const lastName = ref('')

const handleLogin = async () => {
  const user = {
    firstName: firstName.value,
    lastName: lastName.value,
  }
  userStore.setUser(user)
  if (userStore.isAdmin()) await roomStore.getAllRooms()
  router.push({ name: userStore.isAdmin() ? 'roomManagement' : 'roomSearch' })
}
</script>
