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
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axiosInstance'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const userId = ref('')
const password = ref('')
const rememberId = ref(false)
const error = ref('')

onMounted(() => {
  const savedId = localStorage.getItem('savedUserId')
  if (savedId) {
    userId.value = savedId
    rememberId.value = true
  }
})

watch(rememberId, (checked) => {
  if (!checked) localStorage.removeItem('savedUserId')
})

const handleLogin = async () => {
  try {
    const formData = new URLSearchParams()
    formData.append('username', userId.value)
    formData.append('password', password.value)

    await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })

    // 로그인 성공 시 사용자 정보 가져오기
    await new Promise(resolve => setTimeout(resolve, 100)) // 세션 반영 기다림
    const userInfo = await axios.get('/api/user/info', { withCredentials: true })
    const { id, name, fetchedUserId, email, role = 'USER' } = userInfo.data;
    console.log("1111 -> " + id)
    // const role = userInfo.data.role || 'USER'

    auth.login({
      id,
      role,
      username: name,
      userId: fetchedUserId,
      email
    })

    if (rememberId.value) {
      localStorage.setItem('savedUserId', fetchedUserId)
    }

    // role에 따라 이동
    if (role === 'ADMIN') {
      router.push('/admin/dashboard')
    } else {
      router.push('/mypage')
    }

  } catch (err) {
    console.error(err)
    error.value = '아이디 또는 비밀번호가 잘못되었거나 서버 오류입니다.'
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
</style>
