// src/modules/mypage/composables/useUserInfo.js

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

    // ✅ 사용자 정보 불러오는 함수 (재사용 가능)
    async function fetchUserInfo() {
        isLoading.value = true
        try {
            const res = await axios.get('/api/user/info')

            user.value = {
                userId: res.data.userId,
                name: res.data.name,
                email: res.data.email,
                phoneNumber: res.data.phoneNumber,
                signupType: res.data.signupType,
                signupDate: res.data.signupDate,
                role: res.data.role,
                lastLoginAt: res.data.lastLoginAt, // 마이페이지용
            }

            isLoggedIn.value = true
        } catch (err) {
            console.error('❌ 유저 정보를 불러오는 중 오류 발생:', err)
            user.value = null
            isLoggedIn.value = false

            // 인증 실패 시 로그인 페이지로 이동
            if (err.response?.status === 401 && route.path !== '/login') {
                router.push('/login')
            }
        } finally {
            isLoading.value = false
        }
    }

    // ✅ 마운트 시 사용자 정보 자동 로딩 (로그인/회원가입 페이지 제외)
    onMounted(async () => {
        const publicPages = ['/', '/login', '/register']
        const currentPath = route.path

        if (!publicPages.some(path => currentPath.startsWith(path))) {
            await fetchUserInfo()
        } else {
            isLoading.value = false
        }
    })

    return {
        user,
        isLoggedIn,
        isLoading,
        fetchUserInfo, // 필요하면 외부에서 직접 재호출 가능
    }
}
