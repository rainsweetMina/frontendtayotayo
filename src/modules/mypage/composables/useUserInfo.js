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
        try {
            const res = await api.get('/api/user/info', { withCredentials: true })

            user.value = {
                ...auth.user,
                ...res.data
            }

            auth.login(user.value)
            isLoggedIn.value = true

        } catch (err) {
            isLoggedIn.value = false
            user.value = null

            if (err.response?.status === 401 && !['/login', '/register'].includes(route.path)) {
                router.push('/login')
            }
        }
    }

    onMounted(async () => {
        const publicPaths = ['/', '/login', '/register']
        const isPublic = publicPaths.includes(route.path)

        if (auth.user) {
            user.value = { ...auth.user }
            isLoggedIn.value = true
        }

        if (!isPublic) {
            isLoading.value = true
            await fetchUserInfo()
            isLoading.value = false
        } else {
            isLoading.value = false
        }
    })

    return {
        user,
        isLoggedIn,
        isLoading,
        fetchUserInfo
    }
}
