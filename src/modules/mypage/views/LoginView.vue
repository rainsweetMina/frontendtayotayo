<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2>로그인</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="userId">아이디</label>
          <input type="text" v-model="userId" required />
        </div>
        <div>
          <label for="password">비밀번호</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">로그인</button>
        <p v-if="error" style="color: red">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const userId = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const formData = new URLSearchParams()
    formData.append('username', userId.value)
    formData.append('password', password.value)

    const response = await axios.post('/login', formData, {
      withCredentials: true, // ✅ 세션 쿠키 유지
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    // 로그인 성공 후 페이지 이동
    router.push('/mypage')
  } catch (err) {
    if (err.response && err.response.status === 401) {
      error.value = '아이디 또는 비밀번호가 잘못되었습니다.'
    } else {
      error.value = '로그인 중 오류가 발생했습니다.'
    }
    console.error(err)
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 전체 화면 높이 기준 중앙 정렬 */
  background-color: #f5f5f5;
}

.login-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
</style>
