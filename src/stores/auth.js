// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        id:null,
        role: null,
        username: null,
        userId: null,
        email: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.role,
        isAdmin: (state) => state.role === 'ADMIN',
        isUser: (state) => state.role === 'USER'
    },
    actions: {
        login({id, role, username, userId, email }) {
            this.id = id
            this.role = role
            this.username = username
            this.userId = userId
            this.email = email
        },
        logout() {
            this.id = null
            this.role = null
            this.username = null
            this.userId = null
            this.email = null
        }
    },
    persist: {
        storage: sessionStorage
    }
})
