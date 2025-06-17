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
        <input v-model="form.email" type="email" :disabled="isSocial" required />

        <label>전화번호</label>
        <input v-model="form.phoneNumber" type="text" />

        <label>가입유형</label>
        <input :value="user.signupType" disabled />

        <label>가입일</label>
        <input :value="formattedSignupDate" disabled />
      </div>

      <!-- 비밀번호 변경 섹션은 일반 가입자만 -->
      <div class="form-section" v-if="!isSocial">
        <h3>비밀번호 변경</h3>

        <label>현재 비밀번호 확인</label>
        <input v-model="form.currentPassword" type="password" />

        <label>새 비밀번호</label>
        <input v-model="form.newPassword" type="password" @input="validateNewPassword" />
        <p class="error" v-if="form.newPassword && !passwordValid">영문, 숫자, 특수문자 포함 8자 이상이어야 합니다.</p>
        <p class="success" v-if="form.newPassword && passwordValid">사용 가능한 비밀번호입니다.</p>

        <label>새 비밀번호 확인</label>
        <input v-model="form.confirmPassword" type="password" />
        <p class="error" v-if="form.confirmPassword && form.newPassword !== form.confirmPassword">비밀번호가 일치하지 않습니다.</p>
        <p class="success" v-if="form.confirmPassword && form.newPassword === form.confirmPassword">비밀번호가 일치합니다.</p>
      </div>


      <div class="form-actions">
        <button type="submit">수정하기</button>
        <router-link to="/mypage">뒤로가기</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import api from '@/api/axiosInstance'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const { user, fetchUserInfo } = useUserInfo()
const passwordValid = ref(false)
const isSocial = computed(() => user.value?.signupType !== 'GENERAL')

// 🔁 캐시 초기화를 위한 전역 변수 접근 (동일 모듈 내에서만 가능)
import { isUserInfoFetched } from '@/modules/mypage/composables/useUserInfo'

const form = ref({
  name: '',
  email: '',
  phoneNumber: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(async () => {
  const success = await fetchUserInfo()
  if (!success) {
    router.push('/login')
    return
  }

  form.value.name = user.value.username || ''
  form.value.email = user.value.email || ''
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
    console.log('📦 제출 직전 form.value:', form.value)

    // ✅ 1. 일반 정보 수정 요청
    await api.post(
        '/api/mypage/modify',
        {
          username: form.value.name,
          email: form.value.email,
          phoneNumber: form.value.phoneNumber
        },
        { withCredentials: true }
    )

    // ✅ 2. 비밀번호 변경 요청
    if (form.value.newPassword) {
      await api.post(
          '/api/mypage/password',
          {
            currentPassword: form.value.currentPassword,
            modifyPassword: form.value.newPassword,
            modifyPasswordCheck: form.value.confirmPassword
          },
          { withCredentials: true }
      )

      auth.logout()
      alert('🔐 비밀번호가 변경되었습니다.\n다시 로그인해주세요.')
      router.push('/login')
      return
    }

    // ✅ 3. 사용자 정보 캐시 리셋 및 재조회
    isUserInfoFetched.value = false
    await fetchUserInfo()

    alert('✅ 회원정보가 수정되었습니다.')
    router.push('/mypage')
  } catch (err) {
    console.error('❌ 수정 오류:', err)
    alert(err.response?.data?.message || '수정 중 오류가 발생했습니다.')
  }

  const validateNewPassword = () => {
    const password = form.value.newPassword
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,}$/
    passwordValid.value = regex.test(password)
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
