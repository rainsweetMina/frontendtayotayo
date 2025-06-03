<template>
  <template v-if="!isLoggedIn">
    <li class="nav-item">
      <router-link to="/login" class="nav-link">회원가입(로그인)</router-link>
    </li>
  </template>
  <template v-else>
    <template v-if="isLoggedIn">
      <li v-if="role === 'USER'" class="nav-item">
        <router-link to="/mypage" class="nav-link">마이페이지</router-link>
      </li>
      <li v-if="role === 'ADMIN'" class="nav-item">
        <router-link to="/admin/dashboard" class="nav-link">관리자 페이지</router-link>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" @click.prevent="handleLogout">로그아웃</a>
      </li>
    </template>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'

const router = useRouter()
const { user, isLoggedIn } = useUserInfo()

const role = computed(() => user.value?.role || null)
const props = defineProps({role: String})

const handleLogout = async () => {
  try {
    await axios.post('/api/logout', null, {
      withCredentials: true
    });
    window.location.href = '/login'
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
