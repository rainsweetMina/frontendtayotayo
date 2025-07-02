<template>
  <div class="oauth-success">
    소셜로그인 중입니다
  </div>
</template>

<script setup>
import api from '@/api/axiosInstance'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { fetchUserInfo, user } = useUserInfo()  // ✅ user 같이 구조분해 추가!
const auth = useAuthStore()

onMounted(() => {
  setTimeout(async () => {
    const ok = await fetchUserInfo()

    if (auth.userId) {
      router.push('/mypage')
    } else {
      console.warn('[OAuthSuccess] ⛔ 로그인 실패, 로그인 페이지로 이동')
      router.push('/login?error=세션없음')
    }
  }, 300)
})
</script>

<style scoped>
.oauth-success {
  padding: 2rem;
  text-align: center;
  font-weight: bold;
}
</style>
