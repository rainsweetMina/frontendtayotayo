<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2>로그인</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <input type="text" v-model="userId" placeholder="아이디" required />
        </div>
        <div>
          <input type="password" v-model="password" placeholder="비밀번호" required />
        </div>

        <div class="remember-box">
          <input type="checkbox" id="rememberId" v-model="rememberId" />
          <label for="rememberId">아이디 저장</label>
        </div>

        <button type="submit">로그인</button>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>

      <div class="social-login">
        <p>SNS 계정으로 로그인</p>
        <button @click="loginWithGoogle">Google</button>
        <button @click="loginWithKakao">Kakao</button>
      </div>

      <div class="register-link">
        <p>아직 계정이 없으신가요?</p>
        <button @click="goToRegister">회원가입</button>
      </div>

      <!-- 🔑 비밀번호 찾기 링크 추가 -->
      <div class="find-password">
        <router-link to="/find-password">비밀번호를 잊으셨나요?</router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/api/axiosInstance'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { resetUserInfo, fetchUserInfo } = useUserInfo()

const userId = ref('admin')
const password = ref('!1aaaaaa')
const rememberId = ref(false)
const error = ref('')

onMounted(() => {
  const savedId = localStorage.getItem('savedUserId')
  if (savedId && savedId !== 'null' && savedId !== 'undefined') {
    userId.value = savedId
    rememberId.value = true
  } else {
    userId.value = 'user'
  }
})

watch(rememberId, (checked) => {
  if (!checked) {
    localStorage.removeItem('savedUserId')
  }
})

const handleLogin = async () => {
  error.value = ''

  try {
    // ✅ 기존 로그인 정보 완전 초기화 (Pinia + 캐시 + localStorage)
    auth.logout(true)
    resetUserInfo()

    const formData = new URLSearchParams()
    formData.append('username', userId.value)
    formData.append('password', password.value)

    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    })

    // ✅ 백엔드에서 JSON 형태로 accessToken을 전송받을 때 처리
    if (response.data && response.data.accessToken) {
      // auth store를 통해 accessToken 관리
      auth.setAccessToken(response.data.accessToken)
    }

    // ✅ 로그인 후 사용자 정보 강제 재요청
    const success = await fetchUserInfo(true)
    if (!success) {
      error.value = '사용자 정보를 불러오지 못했습니다.'
      return
    }

    const redirectPath =
        route.query.redirect || (auth.role === 'ADMIN' ? '/admin/dashboard' : '/mypage')
    router.push(redirectPath)

  } catch (err) {
    console.error('❌ 로그인 실패:', err)
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = '아이디 또는 비밀번호가 잘못되었습니다.'
    }
  }
}

const goToRegister = () => {
  router.push('/register')
}

const loginWithGoogle = () => {
  window.location.href = 'https://localhost:8081/oauth2/authorization/google'
}

const loginWithKakao = () => {
  window.location.href = 'https://localhost:8081/oauth2/authorization/kakao'
}
</script>


<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-container {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

form div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.remember-box {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: -0.5rem;
  font-size: 0.9rem;
  color: #333;
}

button[type="submit"] {
  padding: 0.75rem;
  background-color: #4889cd;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button[type="submit"]:hover {
  background-color: #2877cd;
}

.error-msg {
  color: red;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.social-login {
  margin-top: 1.5rem;
}

.social-login p {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #666;
}

.social-login button {
  margin: 0 6px;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
}

.social-login button:first-child {
  background-color: #4285f4;
  color: white;
}

.social-login button:last-child {
  background-color: #fee500;
  color: #3c1e1e;
}

.register-link {
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #555;
}

.register-link p {
  margin-bottom: 0.5rem;
}

.register-link button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s;
}

.register-link button:hover {
  background-color: #388e3c;
}

.find-password {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.find-password a {
  color: #4889cd;
  text-decoration: none;
}

.find-password a:hover {
  text-decoration: underline;
}
</style>
