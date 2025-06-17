import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/modules/mypage/store/userStore'
import api from '@/api/axiosInstance'

export const user = ref(null)
export const isLoading = ref(false)
export const isLoggedIn = ref(false)
export const isUserInfoFetched = ref(false) // ✅ 외부에서도 리셋 가능

export function useUserInfo() {
    const auth = useAuthStore()
    const userStore = useUserStore()

    async function fetchUserInfo(force = false) {
        if (isUserInfoFetched.value && !force) {
            console.log('[fetchUserInfo] ⚠️ 캐시된 상태로 요청 생략')
            return isLoggedIn.value
        }

        isUserInfoFetched.value = true
        isLoading.value = true
        console.log('[fetchUserInfo] 🔍 사용자 정보 요청 시작')

        try {
            const res = await api.get('/api/user/info', { withCredentials: true })
            console.log('[fetchUserInfo] ✅ 서버 응답:', res.data)

            const {
                id, userId, username, email, role,
                lastLoginAt, name, phoneNumber,
                signupDate, signupType
            } = res.data

            if (!userId) {
                throw new Error('[fetchUserInfo] ❌ userId 없음!')
            }

            const userData = {
                id, userId, username, email, role,
                lastLoginAt, name, phoneNumber,
                signupDate, signupType
            }

            user.value = userData
            userStore.setUser(userData)
            auth.login(userData)

            isLoggedIn.value = true
            return true
        } catch (err) {
            console.error('[fetchUserInfo] ❌ 에러 발생:', err)
            user.value = null
            auth.logout()
            userStore.setUser(null)
            isLoggedIn.value = false
            isUserInfoFetched.value = false
            return false
        } finally {
            isLoading.value = false
        }
    }

    return {
        user,
        isLoggedIn,
        isLoading,
        fetchUserInfo
    }
}
