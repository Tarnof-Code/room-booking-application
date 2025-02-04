import { defineStore } from 'pinia'
import axios from 'axios'

export const useRoomStore = defineStore('roomStore', {
  state: () => ({
    rooms: [],
    currentRoom: {},
  }),

  actions: {
    async getAllRooms() {
      try {
        const response = await axios.get('http://localhost:5000/room')
        this.rooms = response.data
      } catch (error) {
        console.error('Erreur lors de la récupération des salles', error)
      }
    },
    async getAvailableRooms(date, startTime, endTime) {
      const requestBody = {
        date: date,
        startTime: startTime,
        endTime: endTime,
      }
      try {
        const response = await axios.post('http://localhost:5000/room/available', requestBody)
        this.rooms = response.data
      } catch (error) {
        console.error('Erreur lors de la récupération des salles disponibles', error)
      }
    },
    setCurrentRoom(roomData) {
      this.currentRoom = roomData
    },
    resetRoomsList() {
      this.rooms = []
    },
  },
})
