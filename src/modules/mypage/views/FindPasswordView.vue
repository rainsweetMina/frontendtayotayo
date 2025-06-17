<!-- src/views/FindPasswordView.vue -->
<template>
  <div class="find-password-container">
    <h2>🔑 비밀번호 찾기</h2>
    <form @submit.prevent="handleReset">
      <label>아이디</label>
      <input v-model="form.userId" type="text" required placeholder="아이디를 입력하세요" />

      <label>이메일</label>
      <input v-model="form.email" type="email" required placeholder="가입한 이메일을 입력하세요" />

      <button type="submit" :disabled="loading">임시 비밀번호 발급</button>
    </form>

    <!-- ✅ 로딩 중 메시지 -->
    <p v-if="loading" class="info">⏳ 임시 비밀번호를 발급 중입니다</p>

    <p v-if="message && !loading" class="success">{{ message }}</p>
    <p v-if="error && !loading" class="error">{{ error }}</p>

    <router-link to="/login">← 로그인 화면으로</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/axiosInstance'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({ userId: '', email: '' })
const message = ref('')
const error = ref('')
const loading = ref(false)

const handleReset = async () => {
  message.value = ''
  error.value = ''
  loading.value = true

  try {
    const res = await api.post('api/reset-password', {
      userId: form.value.userId,
      email: form.value.email
    })

    message.value = res.data.message || '임시 비밀번호가 이메일로 발송되었습니다.'
    form.value.userId = ''
    form.value.email = ''
  } catch (err) {
    error.value = err.response?.data?.message || '처리 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.find-password-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

button {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.7rem;
  background-color: #4889cd;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success {
  color: green;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
