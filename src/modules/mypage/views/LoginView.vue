<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2>로그인</h2>

      <!-- ─────────── 로그인 폼 ─────────── -->
      <form @submit.prevent="handleLogin">
        <div>
          <input type="text" v-model="userId" placeholder="아이디" required />
        </div>
        <div>
          <input type="password" v-model="password" placeholder="비밀번호" required />
        </div>

        <!-- ───── 아이디 저장 체크박스 ───── -->
        <div class="remember-box">
          <input type="checkbox" id="rememberId" v-model="rememberId" />
          <label for="rememberId">아이디 저장</label>
        </div>

        <button type="submit">로그인</button>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>

      <!-- ─────────── SNS 로그인 ─────────── -->
      <div class="social-login">
        <p>SNS 계정으로 로그인</p>
        <button @click="loginWithGoogle">Google</button>
        <button @click="loginWithKakao">Kakao</button>
      </div>

      <!-- ─────────── 회원가입 / 비밀번호 찾기 ─────────── -->
      <div class="register-link">
        <p>아직 계정이 없으신가요?</p>
        <button @click="goToRegister">회원가입</button>
      </div>
      <div class="find-password">
        <router-link to="/find-password">비밀번호를 잊으셨나요?</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch, nextTick, computed} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/axiosInstance'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const userId = ref('admin')
const password = ref('!1aaaaaa')
const rememberId = ref(false)
const error = ref('')

// BASE_URL을 computed로 선언
const BASE_URL = computed(() => import.meta.env.VITE_BASE_URL)

/* --------------------------------------------------
 * 저장된 아이디 복원
 * -------------------------------------------------- */
onMounted(() => {
  const savedId = localStorage.getItem('savedUserId')
  if (savedId) {
    userId.value = savedId
    rememberId.value = true
  }
})

watch(rememberId, checked => {
  if (!checked) localStorage.removeItem('savedUserId')
})

/* --------------------------------------------------
 * 로그인 처리
 * -------------------------------------------------- */
/* --------------------------------------------------
 * 로그인 처리 (수정본)
 * -------------------------------------------------- */
const handleLogin = async () => {
  error.value = ''

  try {
    /* 1) 기존 세션·스토어 초기화 */
    auth.logout(true)

    /* 2) 로그인 요청 -------------------------------- */
    const loginBody = {                    // ✅ JSON 바디
      userId: userId.value,                // ✅ userId 필드명
      password: password.value
    }

    const { data: tokenRes } = await api.post(
        '/api/auth/login',                   // ✅ 실제 백엔드 경로
        loginBody,
        { withCredentials: true }            // JSON이면 헤더 지정 불필요
    )

    /* 2-1) 토큰 저장 ------------------------------ */
    const {
      accessToken,
      refreshToken,
      expiresIn = 3600
    } = tokenRes

    // auth.setTokens()에서 이미 localStorage에 저장하므로 중복 제거
    auth.setTokens(accessToken, refreshToken, expiresIn)

    /* 3) 아이디 저장 ------------------------------ */
    if (rememberId.value) {
      localStorage.setItem('savedUserId', userId.value)
    }

    /* 4) 사용자 정보 조회 -------------------------- */
    const { data: userInfo } = await api.get('/api/user/info', {
      withCredentials: true
    })
    auth.login({ ...userInfo, accessToken, refreshToken, expiresIn })

    await nextTick()

    /* 5) 리다이렉트 경로 결정 ---------------------- */
    const rawRedirect = route.query.redirect
    const decodedRedirect = rawRedirect ? decodeURIComponent(rawRedirect) : null
    const role = auth.role

    let redirectPath = '/'
    if (role === 'USER' && decodedRedirect) {
      redirectPath = decodedRedirect
    } else if (role === 'ADMIN') {
      redirectPath = '/admin/dashboard'
    } else if (role === 'BUS') {
      redirectPath = '/admin/lost'
    } else {
      redirectPath = '/mypage'
    }

    router.push(redirectPath)
  } catch (err) {
    console.error('❌ 로그인 실패:', err)
    error.value =
        err.response?.data?.message ?? '아이디 또는 비밀번호가 잘못되었습니다.'
  }
}

const goToRegister = () => router.push('/register')
const loginWithGoogle = () => (window.location.href = `/oauth2/authorization/google`)
const loginWithKakao = () => (window.location.href = `/oauth2/authorization/kakao`)
</script>

<style scoped>
.login-wrapper {
  display: flex; justify-content: center; align-items: center;
  height: 100vh; background-color: #f5f5f5;
}
.login-container {
  background: #fff; padding: 2.5rem 2rem; border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,.1); max-width: 400px; width: 100%;
  text-align: center;
}
h2 { margin-bottom: 1.5rem; font-size: 1.6rem; color: #333; }
form { display: flex; flex-direction: column; gap: 1rem; }
form div { display: flex; flex-direction: column; align-items: flex-start; }
input[type='text'], input[type='password'] {
  width: 100%; padding: .75rem; border: 1px solid #ccc;
  border-radius: 6px; font-size: 1rem; box-sizing: border-box;
}
.remember-box {
  display: flex; align-items: center; gap: .4rem; margin-top: -.5rem;
  font-size: .9rem; color: #333;
}
button[type='submit'] {
  padding: .75rem; background-color: #4889cd; color: #fff;
  border: none; border-radius: 6px; font-size: 1rem; cursor: pointer;
  transition: background-color .2s;
}
button[type='submit']:hover { background-color: #2877cd; }
.error-msg { color: red; margin-top: .5rem; font-size: .9rem; }
.social-login { margin-top: 1.5rem; }
.social-login p { margin-bottom: .5rem; font-size: .95rem; color: #666; }
.social-login button {
  margin: 0 6px; padding: .6rem 1.2rem; border: none; border-radius: 4px;
  cursor: pointer; font-size: .95rem;
}
.social-login button:first-child { background: #4285f4; color: #fff; }
.social-login button:last-child { background: #fee500; color: #3c1e1e; }
.register-link { margin-top: 1.5rem; font-size: .95rem; color: #555; }
.register-link p { margin-bottom: .5rem; }
.register-link button {
  padding: .5rem 1rem; border: none; background: #4caf50; color: #fff;
  border-radius: 6px; cursor: pointer; font-size: .95rem;
  transition: background-color .2s;
}
.register-link button:hover { background: #388e3c; }
.find-password { margin-top: 1rem; font-size: .9rem; }
.find-password a { color: #4889cd; text-decoration: none; }
.find-password a:hover { text-decoration: underline; }
</style>