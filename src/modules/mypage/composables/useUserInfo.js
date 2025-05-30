import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'https://localhost:8081'

export function useUserInfo() {
    const user = ref({
        name: '',
        email: ''
    })
    const router = useRouter()

    onMounted(async () => {
        try {
            const res = await axios.get('/api/user/info')
            user.value = {
                name: res.data.username,
                email: res.data.email
            }
        } catch (err) {
            console.error('유저 정보를 불러오는 중 오류 발생:', err)

            // ✅ 로그인 안되어 있으면 로그인 페이지로 이동
            if (err.response && err.response.status === 401) {
                router.push('/login')
            }
        }
    })

    return { user }
}
