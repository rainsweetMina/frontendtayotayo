<template>
  <div class="withdraw-container">
    <h2>회원 탈퇴</h2>
    <p>정말로 탈퇴하시겠습니까?</p>
    <p class="warning">탈퇴 후에는 계정을 복구할 수 없습니다.</p>

    <input
        type="password"
        v-model="password"
        placeholder="비밀번호 입력"
        class="password-input"
    />

    <div class="actions">
      <button @click="withdraw">탈퇴하기</button>
      <router-link to="/mypage">취소</router-link>
    </div>
  </div>
</template>

<script setup>
import api from '@/api/axiosInstance'

import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const router = useRouter()
const auth = useAuthStore()
const password = ref('')

const withdraw = async () => {
  if (!password.value) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  const confirmResult = window.confirm(
      '정말로 탈퇴하시겠습니까?\n탈퇴 후에는 계정을 복구할 수 없습니다.'
  )
  if (!confirmResult) return

  try {
    await api.post('/api/mypage/withdraw', { password: password.value }, { withCredentials: true })
    auth.logout()
    alert('회원 탈퇴가 완료되었습니다.')
    router.push('/login')
  } catch (err) {
    console.error('❌ 탈퇴 실패:', err)
    alert(err.response?.data?.message || '탈퇴 중 오류가 발생했습니다.')
  }
}
</script>

<style scoped>
.withdraw-container {
  max-width: 480px;
  margin: 80px auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
  color: #2c3e50;
  text-align: center;
}

.withdraw-container h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.withdraw-container p.warning {
  color: #d32f2f;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.password-input {
  width: 100%;
  padding: 0.6rem 1rem;
  margin: 1rem 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f9f9f9;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.password-input:focus {
  outline: none;
  border-color: #1976d2;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(25, 118, 210, 0.3);
}

.actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.actions button {
  background-color: #e53935;
  color: white;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.actions button:hover {
  background-color: #c62828;
}

.actions a {
  color: #666;
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.actions a:hover {
  background-color: #e0e0e0;
}
</style>

