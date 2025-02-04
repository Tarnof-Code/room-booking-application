import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: undefined,
  }),

  actions: {
    setUser(user) {
      this.user = user
    },
    isAdmin() {
      return this.user?.firstName === 'admin' && this.user?.lastName === 'admin'
    },
    logOut() {
      this.user = null
    },
  },
})
