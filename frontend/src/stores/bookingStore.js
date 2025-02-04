import { defineStore } from 'pinia'
import axios from 'axios'

export const useBookingStore = defineStore('bookingStore', {
  state: () => ({
    bookings: [],
    currentBooking: {},
  }),

  actions: {
    async getBookingsByUser(firstName, lastName) {
      const user = {
        firstName: firstName,
        lastName: lastName,
      }
      try {
        const response = await axios.post('http://localhost:5000/booking/userBookings', user)
        this.bookings = response.data
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations', error)
      }
    },
    setCurrentBooking(bookingData) {
      this.currentBooking = bookingData
    },
    resetBookings() {
      this.bookings = []
    },
  },
})
