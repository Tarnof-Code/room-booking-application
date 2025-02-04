<template>
  <v-container>
    <v-form ref="form" @submit.prevent="searchAvailableRooms">
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="formData.date"
            label="Date"
            type="date"
            :rules="rules.date"
            clearable
            required
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="formData.startTime"
            label="Heure de début"
            type="time"
            :rules="rules.startTime"
            clearable
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="formData.endTime"
            label="Heure de fin"
            type="time"
            :rules="rules.endTime"
            clearable
            required
          ></v-text-field>
        </v-col>
        <v-col cols="auto">
          <v-btn type="submit" color="primary" size="large">Rechercher</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoomStore } from '@/stores/roomStore'
import { useBookingStore } from '@/stores/bookingStore'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const roomStore = useRoomStore()
const bookingStore = useBookingStore()

const rules = {
  date: [
    (date) => {
      return date ? true : 'Veuillez renseigner une date'
    },
    (date) => {
      const today = new Date().toISOString().split('T')[0]
      return date >= today ? true : 'La date renseignée est passée'
    },
  ],
  startTime: [
    (startTime) => {
      return startTime ? true : 'Veuillez renseigner une heure de début'
    },
  ],
  endTime: [
    (endTime) => {
      return endTime ? true : 'Veuillez renseigner une heure de fin'
    },
    (endTime) => {
      if (formData.value.startTime && endTime) {
        return endTime > formData.value.startTime
          ? true
          : "L'heure de fin doit être après l'heure de début"
      }
      return true
    },
  ],
}

const form = ref(null)
const formData = ref({
  date: '',
  capacity: null,
  equipements: '',
  startTime: '',
  endTime: '',
})

const loadBookingData = async () => {
  if (bookingStore.currentBooking) {
    formData.value.date = bookingStore.currentBooking.date || ''
    formData.value.startTime = bookingStore.currentBooking.startTime || ''
    formData.value.endTime = bookingStore.currentBooking.endTime || ''
  }
}

const searchAvailableRooms = async () => {
  const formValidation = await form.value.validate()
  if (!formValidation.valid) {
    bookingStore.setCurrentBooking({})
    return
  }
  const date = dayjs.utc(formData.value.date, 'YYYY-MM-DD').toISOString()
  const startTime = dayjs
    .utc(`${formData.value.date} ${formData.value.startTime}`, 'YYYY-MM-DD HH:mm')
    .toISOString()
  const endTime = dayjs
    .utc(`${formData.value.date} ${formData.value.endTime}`, 'YYYY-MM-DD HH:mm')
    .toISOString()
  await roomStore.getAvailableRooms(date, startTime, endTime)
  bookingStore.setCurrentBooking(formData.value)
}

onMounted(loadBookingData)
</script>
