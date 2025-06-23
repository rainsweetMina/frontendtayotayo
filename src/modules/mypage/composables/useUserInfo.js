// modules/mypage/composables/useUserInfo.js

import { ref, nextTick } from 'vue'
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
            return isLoggedIn.value
        }

        isUserInfoFetched.value = true
        isLoading.value = true

        try {
            const res = await api.get('/api/user/info', { withCredentials: true })

            const {
                id, userId, username, email, role,
                lastLoginAt, name, phoneNumber,
                signupDate, signupType
            } = res.data

            if (!userId || !role) throw new Error('[fetchUserInfo] ❌ userId 또는 role 없음!')

            const userData = {
                id, userId, username, email, role,
                lastLoginAt, name, phoneNumber,
                signupDate, signupType
            }

            // ✅ 상태 반영
            user.value = userData
            userStore.setUser(userData)
            auth.login(userData)

            await nextTick() // 🔑 상태 반영 기다림 (role 접근 문제 방지)

            // ✅ 로그인 상태 표시
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