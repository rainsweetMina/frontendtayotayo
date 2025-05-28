import { ref, onMounted } from 'vue'
import axios from 'axios'

export function useUserInfo() {
    const user = ref({
        name: '',
        email: ''
    })

    onMounted(async () => {
        try {
            const res = await axios.get('/api/user/info', {
                withCredentials: true  // ✅ 세션 쿠키 유지 필수!
            })
            user.value = {
                name: res.data.username,  // ⚠️ 백엔드의 필드명과 맞춰주세요
                email: res.data.email
            }
        } catch (err) {
            console.error('유저 정보를 불러오는 중 오류 발생:', err)
        }
    })

    return { user }
}
