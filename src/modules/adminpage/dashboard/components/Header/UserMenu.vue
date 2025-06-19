<template>
  <div class="user-menu d-flex align-items-center">
  <template v-if="!isAuthenticated">
      <router-link to="/login" class="btn btn-light me-2">회원가입(로그인)</router-link>
  </template>
  <template v-else>
      <div class="d-flex align-items-center">
        <router-link v-if="userRole === 'USER'" to="/mypage" class="btn btn-light me-3">마이페이지</router-link>
        <router-link v-if="userRole === 'ADMIN'" to="/admin/dashboard" class="btn btn-light me-3">관리자 페이지</router-link>
        <button @click="handleLogout" class="btn btn-outline-danger">로그아웃</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo.js'

const router = useRouter()
const auth = useAuthStore()
const { user, isLoggedIn, resetUserInfo } = useUserInfo()

// localStorage에서 인증 정보 확인
const isAuthenticated = computed(() => {
  const accessToken = localStorage.getItem('accessToken')
  const authData = localStorage.getItem('auth')
  
  // accessToken과 auth 정보가 모두 있어야 로그인된 것으로 간주
  return !!(accessToken && authData && auth.userId)
})

const userRole = computed(() => {
  // auth store에서 role 가져오기
  return auth.role || user.value?.role || null
})

const handleLogout = async () => {
  try {
    // 로그아웃 API 호출
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    })
  } catch (err) {
    console.error('로그아웃 API 호출 실패:', err)
  } finally {
    // 클라이언트 측 정리 작업
    auth.logout(true) // accessToken도 함께 제거
    resetUserInfo()
    
    // 로그인 페이지로 리다이렉트
    router.push('/login')
  }
}

// 컴포넌트 마운트 시 인증 상태 확인
onMounted(() => {
  // localStorage에 인증 정보가 있지만 auth store가 비어있는 경우 복원
  const accessToken = localStorage.getItem('accessToken')
  const authData = localStorage.getItem('auth')
  
  if (accessToken && authData && !auth.userId) {
    try {
      const parsedAuth = JSON.parse(authData)
      auth.login(parsedAuth)
    } catch (err) {
      console.error('Auth 데이터 파싱 실패:', err)
      // 잘못된 데이터는 제거
      auth.logout(true)
    }
  }
})
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
