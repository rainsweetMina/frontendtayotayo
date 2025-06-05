// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
        isAdmin: (state) => state.user?.role === 'ADMIN',
        isUser: (state) => state.user?.role === 'USER'
    },
    actions: {
        login({ role, username, userId, email }) {
            this.user = { role, username, userId, email }
        },
        logout() {
            this.user = null
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'auth',         // ✅ 저장될 localStorage 키명 명시
                storage: localStorage,
                paths: ['user']      // ✅ 저장할 속성 명시
            }
        ]
    }
})
