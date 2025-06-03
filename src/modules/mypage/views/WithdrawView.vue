<template>
  <div class="withdraw-container">
    <h2>회원 탈퇴</h2>
    <p>정말로 탈퇴하시겠습니까?</p>
    <p class="warning">탈퇴 후에는 계정을 복구할 수 없습니다.</p>

    <div class="actions">
      <button @click="withdraw">탈퇴하기</button>
      <router-link to="/mypage">취소</router-link>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const withdraw = async () => {
  try {
    await axios.post('/api/mypage/withdraw')
    auth.logout()
    alert('회원 탈퇴가 완료되었습니다.')
    router.push('/login')
  } catch (err) {
    console.error('❌ 탈퇴 실패:', err)
    alert('탈퇴 중 오류가 발생했습니다.')
  }
}
</script>

<style scoped>
.withdraw-container {
  max-width: 500px;
  margin: 60px auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
  color: #2c3e50;
  text-align: center;
}

.withdraw-container h2 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

.withdraw-container p.warning {
  color: red;
  margin: 1rem 0;
  font-weight: bold;
}

.actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #c0392b;
}

a {
  color: #888;
  font-size: 0.95rem;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
