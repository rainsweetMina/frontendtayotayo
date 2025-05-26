import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        role: null, // 'USER' | 'ADMIN' | null
        username: null
    }),
    actions: {
        login(role, username) {
            this.role = role
            this.username = username
        },
        logout() {
            this.role = null
            this.username = null
        }
    }
})
