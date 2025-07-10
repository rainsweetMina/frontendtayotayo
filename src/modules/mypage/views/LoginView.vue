<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2>로그인</h2>
      <h3>ID : admin</h3>
      <h3>PW : 1!aaaaaa</h3>

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

        <button type="submit" :disabled="isLoggingIn">
          {{ isLoggingIn ? '로그인 중...' : '로그인' }}
        </button>
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
import api, {publicApi} from '@/api/axiosInstance'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const userId = ref('admin')
const password = ref('!1aaaaaa')
const rememberId = ref(false)
const error = ref('')
const isLoggingIn = ref(false) // 로그인 중 상태 추가

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

  // 모바일 환경 확인 및 네트워크 상태 체크
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  console.log('[LoginView] 모바일 환경 감지:', {
    isMobile,
    userAgent: navigator.userAgent,
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt
    } : 'Not supported'
  })

  // 모바일에서 네트워크 상태가 좋지 않으면 경고
  if (isMobile && navigator.connection) {
    const connection = navigator.connection
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      console.warn('[LoginView] 느린 네트워크 감지 - Wi-Fi 연결을 권장합니다')
    }
  }
})

watch(rememberId, checked => {
  if (!checked) localStorage.removeItem('savedUserId')
})

/* --------------------------------------------------
 * 로그인 처리 (수정본)
 * -------------------------------------------------- */
const handleLogin = async () => {
  if (isLoggingIn.value) return // 중복 로그인 방지
  
  error.value = ''
  isLoggingIn.value = true

  try {
    console.log('[LoginView] 로그인 시도 시작 - 모바일 환경 확인:', {
      userAgent: navigator.userAgent,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      localStorage: typeof localStorage !== 'undefined'
    });

    /* 1) 기존 세션·스토어 초기화 */
    auth.logout(true)

    /* 2) 로그인 요청 -------------------------------- */
    const loginBody = {                    // ✅ JSON 바디
      userId: userId.value,                // ✅ userId 필드명
      password: password.value
    }

    console.log('[LoginView] 로그인 요청 데이터:', {
      url: '/api/auth/login',
      body: { ...loginBody, password: '***' },
      withCredentials: true
    });

    const { data: tokenRes } = await publicApi.post(
        '/api/auth/login',                   // ✅ 실제 백엔드 경로
        loginBody,
        { withCredentials: true }            // JSON이면 헤더 지정 불필요
    )

    console.log('[LoginView] 로그인 응답 받음:', {
      hasAccessToken: !!tokenRes.accessToken,
      hasRefreshToken: !!tokenRes.refreshToken,
      expiresIn: tokenRes.expiresIn
    });

    /* 2-1) 토큰 및 사용자 정보 저장 ------------------------------ */
    const {
      accessToken,
      refreshToken,
      expiresIn = 3600
    } = tokenRes

    /* 3) 아이디 저장 ------------------------------ */
    if (rememberId.value) {
      try {
        localStorage.setItem('savedUserId', userId.value)
        console.log('[LoginView] 아이디 저장 완료');
      } catch (e) {
        console.warn('[LoginView] localStorage 저장 실패 (시크릿 모드일 수 있음):', e);
      }
    }

    /* 4) 사용자 정보 조회 -------------------------- */
    console.log('[LoginView] 사용자 정보 조회 시작');
    const { data: userInfo } = await api.get('/api/user/info', {
      withCredentials: true
    })
    console.log('[LoginView] 사용자 정보 조회 완료:', {
      userId: userInfo.userId,
      role: userInfo.role
    });
    
    /* 5) 토큰과 사용자 정보를 한 번에 저장 -------------------------- */
    auth.login({ ...userInfo, accessToken, refreshToken, expiresIn })

    /* 6) 토큰 저장 완료 후 다음 렌더링 사이클까지 대기 -------------------------- */
    await nextTick()
    
    /* 7) 토큰이 제대로 저장되었는지 확인 -------------------------- */
    const savedToken = localStorage.getItem('accessToken')
    console.log('[LoginView] 토큰 저장 확인:', {
      hasToken: !!savedToken,
      tokenLength: savedToken?.length,
      isLoggedIn: auth.isLoggedIn
    })

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

    console.log('[LoginView] 리다이렉트 경로:', redirectPath);
    router.push(redirectPath)
  } catch (err) {
    console.error('❌ 로그인 실패:', err)
    console.error('[LoginView] 상세 에러 정보:', {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      config: {
        url: err.config?.url,
        method: err.config?.method,
        headers: err.config?.headers
      }
    });
    
    // 모바일 환경에서 더 구체적인 에러 메시지 제공
    let errorMessage = '아이디 또는 비밀번호가 잘못되었습니다.'
    
    if (err.message === 'Network Error') {
      errorMessage = '네트워크 연결을 확인해주세요. (모바일에서는 Wi-Fi 연결을 권장합니다)'
    } else if (err.response?.status === 0) {
      errorMessage = '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.'
    } else if (err.response?.status === 401) {
      errorMessage = '아이디 또는 비밀번호가 올바르지 않습니다.'
    } else if (err.response?.status >= 500) {
      errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    }
    
    error.value = errorMessage
  } finally {
    isLoggingIn.value = false
  }
}

const goToRegister = () => router.push('/register')
const loginWithGoogle = () => (window.location.href = `/oauth2/authorization/google`)
const loginWithKakao = () => (window.location.href = `/oauth2/authorization/kakao`)
</script>

<style scoped>
.login-wrapper {
  display: flex; justify-content: center; align-items: center;
  min-height: 100vh; background-color: #f5f5f5;
  padding: 1rem;
  box-sizing: border-box;
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
  /* 모바일에서 입력 필드 최적화 */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
/* 모바일에서 입력 필드 포커스 시 줌 방지 */
input[type='text']:focus, input[type='password']:focus {
  font-size: 16px;
}
.remember-box {
  display: flex; align-items: center; gap: .4rem; margin-top: -.5rem;
  font-size: .9rem; color: #333;
}
button[type='submit'] {
  padding: .75rem; background-color: #4889cd; color: #fff;
  border: none; border-radius: 6px; font-size: 1rem; cursor: pointer;
  transition: background-color .2s;
  /* 모바일에서 터치 최적화 */
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
}
button[type='submit']:hover:not(:disabled) { background-color: #2877cd; }
button[type='submit']:active:not(:disabled) { background-color: #1a5f9e; }
button[type='submit']:disabled { 
  background-color: #ccc; 
  cursor: not-allowed; 
  opacity: 0.7;
}
.error-msg { color: red; margin-top: .5rem; font-size: .9rem; }
.social-login { margin-top: 1.5rem; }
.social-login p { margin-bottom: .5rem; font-size: .95rem; color: #666; }
.social-login button {
  margin: 0 6px; padding: .6rem 1.2rem; border: none; border-radius: 4px;
  cursor: pointer; font-size: .95rem;
  /* 모바일에서 터치 최적화 */
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
}
.social-login button:first-child { background: #4285f4; color: #fff; }
.social-login button:last-child { background: #fee500; color: #3c1e1e; }
.register-link { margin-top: 1.5rem; font-size: .95rem; color: #555; }
.register-link p { margin-bottom: .5rem; }
.register-link button {
  padding: .5rem 1rem; border: none; background: #4caf50; color: #fff;
  border-radius: 6px; cursor: pointer; font-size: .95rem;
  transition: background-color .2s;
  /* 모바일에서 터치 최적화 */
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
}
.register-link button:hover { background: #388e3c; }
.find-password { margin-top: 1rem; font-size: .9rem; }
.find-password a { color: #4889cd; text-decoration: none; }
.find-password a:hover { text-decoration: underline; }

/* 모바일 최적화 */
@media (max-width: 768px) {
  .login-wrapper {
    padding: 0.5rem;
  }
  .login-container {
    padding: 2rem 1.5rem;
    margin: 0;
  }
  h2 {
    font-size: 1.4rem;
  }
  input[type='text'], input[type='password'] {
    font-size: 16px; /* 모바일에서 줌 방지 */
  }
  button[type='submit'], .social-login button, .register-link button {
    font-size: 16px; /* 모바일에서 줌 방지 */
  }
}
</style>