// modules/mypage/composables/useUserInfo.js

import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/modules/mypage/store/userStore'
import api from '@/api/axiosInstance'

export function useUserInfo() {
    const auth = useAuthStore()
    const userStore = useUserStore()
    const user = ref(null)
    const isLoading = ref(false)
    const isLoggedIn = ref(false)
    const isUserInfoFetched = ref(false)

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

            if (!userId) throw new Error('[fetchUserInfo] ❌ userId 없음!')

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
            resetUserInfo()
            auth.logout(true)
            return false
        } finally {
            isLoading.value = false
        }
    }

    function resetUserInfo() {
        user.value = null
        isUserInfoFetched.value = false
        isLoggedIn.value = false
        userStore.setUser(null)
    }

    return {
        user,
        isLoggedIn,
        isLoading,
        fetchUserInfo,
        resetUserInfo,
        isUserInfoFetched
    }
}
