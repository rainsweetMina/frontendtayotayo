<template>
  <div class="user-menu d-flex align-items-center">
  <template v-if="!isLoggedIn">
      <router-link to="/login" class="btn btn-light me-2">회원가입(로그인)</router-link>
  </template>
  <template v-else>
      <div class="d-flex align-items-center">
        <router-link v-if="role === 'USER'" to="/mypage" class="btn btn-light me-3">마이페이지</router-link>
        <router-link v-if="role === 'ADMIN'" to="/admin/dashboard" class="btn btn-light me-3">관리자 페이지</router-link>
        <button @click="handleLogout" class="btn btn-outline-danger">로그아웃</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo.js'

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

<style scoped>
.user-menu {
  display: flex;
  align-items: center;
}

.btn {
  padding: 0.375rem 1rem;
  font-size: 0.95rem;
  white-space: nowrap;
  border-radius: 4px;
}

.btn-light {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
}

.btn-light:hover {
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
  font-weight: 500;
}

.btn-outline-danger:hover {
  color: #fff;
  background-color: #dc3545;
}
</style>
