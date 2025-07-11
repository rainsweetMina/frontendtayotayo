// modules/mypage/composables/useUserInfo.js
import { ref, computed } from 'vue'
import { useAuthStore }  from '@/stores/auth'
import { useUserStore }  from '@/modules/mypage/store/userStore'
import { api }           from '@/api/axiosInstance'

export function useUserInfo() {
    const auth       = useAuthStore()
    const userStore  = useUserStore()

    /* ───────── 상태 ───────── */
    const isLoading          = ref(false)
    const isUserInfoFetched  = ref(false)

    /** auth 스토어에 이미 isLoggedIn(또는 userId 존재 여부) 로직이 있으므로 그대로 사용 */
    const isLoggedIn = computed(() => auth.isLoggedIn)
    
    /** user 상태를 auth 스토어와 동기화 */
    const user = computed(() => auth.isLoggedIn ? {
        id: auth.id,
        userId: auth.userId,
        username: auth.username,
        email: auth.email,
        role: auth.role,
        lastLoginAt: auth.lastLoginAt,
        name: auth.name,
        phoneNumber: auth.phoneNumber,
        signupDate: auth.signupDate,
        signupType: auth.signupType
    } : null)

    /* ───────── 메인 함수 ───────── */
    async function fetchUserInfo(force = false) {
        // 이미 불러왔고, 강제 호출이 아니면 바로 반환
        if (isUserInfoFetched.value && !force) return isLoggedIn.value

        isUserInfoFetched.value = true
        isLoading.value         = true

        try {
            // 토큰 복원 시도
            auth.restoreTokens()
            
            // 세션/쿠키 기반이면 withCredentials 옵션 유지
            const { data } = await api.get('/api/user/info', { withCredentials: true })

            const {
                id,         userId,   username, email,    role,
                lastLoginAt,          name,     phoneNumber,
                signupDate, signupType
            } = data

            if (!userId || !role) throw new Error('userId 또는 role 누락')

            /* 상태 반영 */
            const userData = {
                id, userId, username, email, role,
                lastLoginAt, name, phoneNumber,
                signupDate,  signupType
            }

            userStore.setUser(userData)
            
            // 토큰이 있으면 토큰과 함께 로그인, 없으면 사용자 정보만 설정
            const accessToken = localStorage.getItem('accessToken')
            if (accessToken) {
                auth.login(userData)
            } else {
                // 토큰 없이 사용자 정보만 설정
                Object.assign(auth, userData, { isLoggedIn: true })
            }

            return true
        } catch (err) {
            const code = err?.response?.status
            console.error(`[fetchUserInfo] (${code ?? 'network error'})`, err)

            resetUserInfo()
            auth.logout(true)
            return false
        } finally {
            isLoading.value = false
        }
    }

    /* ───────── 상태 초기화 ───────── */
    function resetUserInfo() {
        isUserInfoFetched.value = false
        userStore.setUser(null)
    }

    /* ───────── 반환 ───────── */
    return {
        user,
        isLoggedIn,
        isLoading,
        fetchUserInfo,
        resetUserInfo,
        isUserInfoFetched,
    }
}
