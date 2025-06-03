<template>
  <div class="register-wrapper">
    <div class="register-box">
      <h2>회원가입</h2>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>아이디</label>
          <div class="id-check-row">
            <input type="text" v-model="form.userId" required />
            <button type="button" class="btn-id-check" @click="checkDuplicateId">중복 확인</button>
          </div>
          <p class="error" v-if="idDuplicate === true">이미 사용 중인 아이디입니다</p>
          <p class="success" v-if="idDuplicate === false">사용 가능한 아이디입니다</p>
        </div>

        <div class="form-group">
          <label>비밀번호</label>
          <input type="password" v-model="form.password" @input="validatePassword" required />
          <p class="error" v-if="form.password && !passwordValid">영문, 숫자, 특수문자 포함 8자 이상이어야 합니다.</p>
          <p class="success" v-if="form.password && passwordValid">사용 가능한 비밀번호입니다</p>
        </div>

        <div class="form-group">
          <label>비밀번호 확인</label>
          <input type="password" v-model="passwordCheck" @input="checkPasswordMatch" required />
          <p class="error" v-if="!passwordsMatch">비밀번호가 일치하지 않습니다</p>
        </div>

        <div class="form-group">
          <label>이름</label>
          <input type="text" v-model="form.username" required />
        </div>

        <div class="form-group">
          <label>이메일</label>
          <div class="email-row">
            <input v-model="emailLocal" type="text" class="email-input" /> @
            <input v-model="emailDomain" type="text" :disabled="emailDomainSelected !== '' && emailDomainSelected !== '직접입력'" class="email-input" />
          </div>
          <div class="email-row">
            <select v-model="emailDomainSelected" @change="handleEmailSelect" class="email-select">
              <option value="">도메인 선택</option>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="daum.net">daum.net</option>
              <option value="kakao.com">kakao.com</option>
              <option value="직접입력">직접입력</option>
            </select>
            <button type="button" @click="sendVerificationCode" :disabled="codeSent" class="btn-small">인증 코드 전송</button>
          </div>
        </div>

        <div class="form-group" v-if="codeSent">
          <label>인증 코드 입력</label>
          <input v-model="form.verificationCode" placeholder="인증 코드 입력" />
          <p class="info">남은 시간: {{ remainingTime }}초</p>
        </div>

        <button type="submit" :disabled="!canSubmit" class="submit-btn">가입하기</button>
        <p class="error" v-if="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const form = ref({
  userId: '',
  password: '',
  verificationCode: '',
  username: '',
  email: '',
})

const passwordCheck = ref('')
const passwordValid = ref(false)
const passwordsMatch = ref(true)
const idDuplicate = ref(null)

const emailLocal = ref('')
const emailDomain = ref('')
const emailDomainSelected = ref('')
const codeSent = ref(false)
const remainingTime = ref(180)
const error = ref('')
let timer = null

const validatePassword = () => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
  passwordValid.value = regex.test(form.value.password)
  checkPasswordMatch()
}

const checkPasswordMatch = () => {
  passwordsMatch.value = form.value.password === passwordCheck.value
}

const checkDuplicateId = async () => {
  try {
    const res = await axios.get(`/api/user/check-id?userId=${form.value.userId}`)
    idDuplicate.value = res.data.duplicate // true: 중복, false: 사용 가능
  } catch (err) {
    idDuplicate.value = true
  }
}

const handleEmailSelect = () => {
  if (emailDomainSelected.value !== '직접입력') {
    emailDomain.value = emailDomainSelected.value
  } else {
    emailDomain.value = ''
  }
}

const sendVerificationCode = async () => {
  form.value.email = `${emailLocal.value}@${emailDomain.value}`
  try {
    await axios.post('/api/email/send', { email: form.value.email })
    codeSent.value = true
    startTimer()
  } catch (err) {
    error.value = '이메일 전송 실패'
  }
}

const startTimer = () => {
  remainingTime.value = 180
  timer = setInterval(() => {
    if (remainingTime.value > 0) remainingTime.value--
    else clearInterval(timer)
  }, 1000)
}

const canSubmit = computed(() =>
    form.value.userId &&
    form.value.username &&
    passwordValid.value &&
    passwordsMatch.value &&
    form.value.verificationCode &&
    idDuplicate.value === false
)

const handleRegister = async () => {
  try {
    await axios.post('/api/user/join', form.value)
    alert('회원가입 완료! 로그인해주세요.')
    window.location.href = '/login'
  } catch (err) {
    error.value = err.response?.data?.message || '회원가입 실패'
  }
}
</script>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
}

.register-box {
  background: white;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.email-row {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.email-input {
  flex: 1;
}

.email-select {
  flex: 2;
}

.btn-small {
  padding: 10px 14px;
  font-size: 14px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-small:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-id-check {
  white-space: nowrap;
  padding: 10px 12px;
  font-size: 14px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #2e7d32;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.id-check-row {
  display: flex;
  gap: 10px;
}

.error {
  color: #e53935;
  font-size: 0.9em;
  margin-top: 5px;
  white-space: nowrap;
}

.success {
  color: #2e7d32;
  font-size: 0.9em;
  margin-top: 5px;
  white-space: nowrap;
}

.info {
  color: #616161;
  font-size: 0.85em;
  margin-top: 5px;
}
</style>
