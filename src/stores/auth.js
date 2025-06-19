import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        id: null,
        role: null,
        username: null,
        userId: null,
        email: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.userId,
        isAdmin: (state) => state.role === 'ADMIN',
        isUser: (state) => state.role === 'USER'
    },

    actions: {
        login({ id = null, role = null, username = '', userId = '', email = '' }) {
            this.id = id
            this.role = role
            this.username = username
            this.userId = userId
            this.email = email
        },

        logout() {
            this.$reset()                          // ✅ Pinia 상태 초기화
            localStorage.removeItem('auth')       // ✅ persist 저장소도 함께 제거
        },

        init() {
            if (!this.userId || !this.role) {
                this.logout()                        // ✅ logout() 호출로 통일
            }
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {
                key: 'auth',                         // ✅ 이 key 이름과 removeItem 대상 일치해야 함
                storage: localStorage,
                paths: ['id', 'role', 'username', 'userId', 'email']
            }
        ]
    }
})
