// 예: src/stores/userStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const user = ref(null)

    const setUser = (userData) => {
        user.value = userData
    }

    return { user, setUser }
})
