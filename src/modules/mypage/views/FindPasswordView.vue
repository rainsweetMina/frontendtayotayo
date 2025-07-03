<template>
  <HeaderComponent />

  <!-- ✅ 헤더 높이(예: 80px) 만큼 여백 추가 -->
  <div class="find-password-container">
    <h2>🔑 임시 비밀번호 발급</h2>

    <form @submit.prevent="handleReset">
      <label>아이디</label>
      <input v-model="form.userId" type="text" required placeholder="아이디를 입력하세요" />

      <label>이메일</label>
      <input v-model="form.email" type="email" required placeholder="가입한 이메일을 입력하세요" />

      <button type="submit" :disabled="loading">임시 비밀번호 발급</button>
    </form>

    <p v-if="loading" class="info">⏳ 임시 비밀번호를 발급 중입니다</p>
    <p v-if="message && !loading" class="success">{{ message }}</p>
    <p v-if="error && !loading"   class="error">{{ error }}</p>

    <router-link to="/login" class="back-link">← 로그인 화면으로 돌아가기</router-link>
  </div>

  <FooterComponent />
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/axiosInstance'
import HeaderComponent  from '@/modules/adminpage/dashboard/components/Header/HeaderComponent.vue'
import FooterComponent  from '@/layouts/DefaultLayout.vue'

const form     = ref({ userId: '', email: '' })
const message  = ref('')
const error    = ref('')
const loading  = ref(false)

const handleReset = async () => {
  message.value = ''
  error.value   = ''
  loading.value = true
  try {
    const { data } = await api.post('/api/reset-password', {
      userId: form.value.userId,
      email : form.value.email
    })
    message.value = data.message || '임시 비밀번호가 이메일로 발송되었습니다.'
    form.value.userId = ''
    form.value.email  = ''
  } catch (err) {
    error.value = err.response?.data?.message || '처리 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 헤더 높이(80px)만큼 위 여백 확보 */
.find-password-container {
  max-width: 400px;
  margin: 120px auto 20px;  /* ⬅️ 아래 여백 줄이기 */
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', sans-serif;
}

h2{margin-bottom:1.5rem;text-align:center;}

label{display:block;margin-top:1rem;font-weight:bold;}

input{
  width:100%;padding:.5rem;margin-top:.3rem;
  border:1px solid #ccc;border-radius:6px;font-size:1rem;
}

button{
  margin-top:1.5rem;width:100%;padding:.7rem;
  background:#4889cd;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;
}
button:disabled{background:#ccc;cursor:not-allowed;}

.success{color:green;margin-top:1rem;}
.error  {color:red;  margin-top:1rem;}

.back-link{
  display:block;text-align:center;margin-top:1.5rem;
  color:#4889cd;text-decoration:underline;
}
.back-link:hover{color:#2877cd}
</style>
