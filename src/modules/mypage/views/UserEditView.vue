<template>
  <div class="edit-form">
    <h2>회원 정보 수정</h2>
    <form @submit.prevent="submit">
      <div class="form-section">
        <label>아이디</label>
        <input :value="user.userId" disabled />

        <label>이름</label>
        <input v-model="form.name" type="text" required />

        <label>이메일</label>
        <input v-model="form.email" type="email" required />

        <label>전화번호</label>
        <input v-model="form.phoneNumber" type="text" />

        <label>가입유형</label>
        <input :value="user.signupType" disabled />

        <label>가입일</label>
        <input :value="formattedSignupDate" disabled />
      </div>

      <div class="form-section">
        <h3>비밀번호 변경</h3>

        <label>현재 비밀번호 확인</label>
        <input v-model="form.currentPassword" type="password" />

        <label>새 비밀번호</label>
        <input v-model="form.newPassword" type="password" />

        <label>새 비밀번호 확인</label>
        <input v-model="form.confirmPassword" type="password" />
      </div>

      <div class="form-actions">
        <button type="submit">수정하기</button>
        <router-link to="/mypage">뒤로가기</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'

const { user } = useUserInfo()
console.log(user)
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  phoneNumber: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  form.value.name = user.value.name
  form.value.email = user.value.email
  form.value.phoneNumber = user.value.phoneNumber || ''
})

const formattedSignupDate = computed(() => {
  if (!user.value?.signupDate) return '정보 없음'

  try {
    const date = new Date(user.value.signupDate)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return '정보 없음'
  }
})

const submit = async () => {
  try {
    await axios.post('/api/mypage/modify', {
      name: form.value.name,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber
    })

    if (form.value.newPassword) {
      await axios.post('/api/mypage/password', {
        currentPassword: form.value.currentPassword,
        newPassword: form.value.newPassword,
        confirmPassword: form.value.confirmPassword
      })
    }

    alert('수정이 완료되었습니다.')
    router.push('/mypage')
  } catch (err) {
    console.error(err)
    alert('수정 중 오류가 발생했습니다.')
  }
}
</script>

<style scoped>
.edit-form {
  max-width: 600px;
  margin: 40px auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
  color: #2c3e50;
}

.edit-form h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border-bottom: 2px solid #4889cd;
  padding-bottom: 0.5rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #333;
}

label {
  display: block;
  margin-top: 0.8rem;
  font-weight: 600;
  color: #555;
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-top: 0.3rem;
  box-sizing: border-box;
  font-size: 0.95rem;
}

input:disabled {
  background: #f4f4f4;
  color: #888;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  background-color: #4889cd;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #316eb3;
}

.cancel-link {
  color: #999;
  text-decoration: none;
  font-size: 0.95rem;
}

.cancel-link:hover {
  text-decoration: underline;
}
</style>
