import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'https://localhost:8081'

const user = ref(null)
const isLoading = ref(true)
const isLoggedIn = ref(false)

export function useUserInfo() {
    const router = useRouter()
    const route = useRoute()

    onMounted(async () => {
        await router.isReady()
        const path = router.currentRoute.value.path
        if (!path.startsWith('/login') && !path.startsWith('/register')) {
            await fetchUserInfo()
        } else {
            isLoading.value = false
        }
    })

    // onMounted(() => {
    //     // 로그인/회원가입/비밀번호 찾기 등에서는 사용자 정보 요청 안 함
    //     const publicPages = ['/login', '/register', '/']
    //     const isPublic = publicPages.some(path => route.path.startsWith(path))
    //
    //     if (!route.path.startsWith('/login') && !route.path.startsWith('/register')) {
    //         fetchUserInfo()
    //     } else {
    //         isLoading.value = false
    //     }
    // })

    async function fetchUserInfo() {
        try {
            const res = await axios.get('/api/user/info')
            user.value = {
                userId: res.data.userId,
                name: res.data.name,
                email: res.data.email,
                phoneNumber: res.data.phoneNumber,
                signupType: res.data.signupType,
                signupDate: res.data.signupDate,
                role: res.data.role
            }
            isLoggedIn.value = true
        } catch (err) {
            console.error('유저 정보를 불러오는 중 오류 발생:', err)
            isLoggedIn.value = false

            // 인증 실패 시 로그인 페이지로 이동
            if (err.response && err.response.status === 401) {
                router.push('/login')
            }
        } finally {
            isLoading.value = false
        }
    }

    return { user, isLoggedIn, isLoading }
}
