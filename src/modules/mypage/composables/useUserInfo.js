import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axiosInstance'

const user = ref(null)
const isLoading = ref(false)
const isLoggedIn = ref(false)
let isUserInfoFetched = false // ✅ 중복 방지용 플래그

export function useUserInfo() {
    const auth = useAuthStore()

    /**
     * 사용자 정보 조회 및 인증 상태 반영
     * @returns {Promise<boolean>} 로그인 성공 여부
     */
    async function fetchUserInfo() {
        if (isUserInfoFetched) {
            console.log('⚠️ [fetchUserInfo] 이미 호출됨. 중복 요청 방지됨')
            return isLoggedIn.value
        }

        isUserInfoFetched = true
        isLoading.value = true
        console.log('🔍 [fetchUserInfo] 시작됨')

        try {
            const res = await api.get('/api/user/info', { withCredentials: true })
            console.log('✅ [fetchUserInfo] 서버 응답:', res.data)

            // ✅ 필요한 필드만 명확히 구조분해
            const {
                id = null,
                role = null,
                username = '',
                userId = '',
                email = ''
            } = res.data

            const userData = { id, role, username, userId, email }

            user.value = userData
            auth.login(userData)

            console.log('✅ [fetchUserInfo] auth.userId:', auth.userId)
            console.log('✅ [fetchUserInfo] auth 전체 상태:', { ...auth })

            isLoggedIn.value = true
            return true
        } catch (err) {
            console.error('❌ [fetchUserInfo] 에러:', err)
            isLoggedIn.value = false
            user.value = null
            auth.logout()
            isUserInfoFetched = false // 에러 시 재시도 가능하도록 플래그 초기화
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