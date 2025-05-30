<template>
  <template v-if="!isAuthenticated">
    <li class="nav-item">
      <router-link to="/login" class="nav-link">회원가입(로그인)</router-link>
    </li>
  </template>
  <template v-else>
    <li v-if="isUser" class="nav-item">
      <router-link to="/mypage" class="nav-link">마이페이지</router-link>
    </li>
    <li v-if="isAdmin" class="nav-item">
      <router-link to="/admin/dashboard" class="nav-link">관리자 페이지</router-link>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#" @click.prevent="handleLogout">로그아웃</a>
    </li>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const auth = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => !!auth.role)
const isUser = computed(() => auth.role === 'USER')
const isAdmin = computed(() => auth.role === 'ADMIN')

const handleLogout = async () => {
  try {
    await axios.post('/api/logout', {}, { withCredentials: true }) // 백엔드 세션 종료 요청
    auth.logout() // Pinia 상태 초기화
    router.push('/') // 홈으로 이동
  } catch (err) {
    console.error('로그아웃 실패:', err)
  }
}
</script>

<style scoped lang="scss">
@use "@/assets/web-user";

.nav-item:hover .nav-link:hover {
  color: #ddd;
}
</style>
