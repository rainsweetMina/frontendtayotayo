import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axiosInstance'

const user = ref(null)
const isLoading = ref(true)
const isLoggedIn = ref(false)

export function useUserInfo() {
    const router = useRouter()
    const route = useRoute()
    const auth = useAuthStore()

    async function fetchUserInfo() {
        isLoading.value = true
        try {
            const res = await api.get('/api/user/info', { withCredentials: true })

            const userData = {
                ...res.data
            }

            user.value = userData
            auth.login(userData)
            isLoggedIn.value = true
        } catch (err) {
            isLoggedIn.value = false
            user.value = null
            auth.logout() // ⭐ Pinia 상태도 초기화

            if (err.response?.status === 401 && !['/login', '/register'].includes(route.path)) {
                router.push('/login')
            }
        } finally {
            isLoading.value = false
        }
    }

    onMounted(async () => {
        await fetchUserInfo()
    })

    return {
        user,
        isLoggedIn,
        isLoading,
        fetchUserInfo
    }
}
