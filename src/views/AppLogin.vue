<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <svg
          class="w-8 h-8 ml-2 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          ></path>
        </svg>
        <span class="text-2xl font-semibold text-gray-700">VueBoard</span>
      </div>

      <form class="mt-4" @submit.prevent="login">
        <label class="block">
          <span class="text-sm text-gray-700">Email</span>
          <input
            type="email"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            v-model="email"
            required
          />
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input
            type="password"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            v-model="password"
            required
          />
        </label>

        <div class="flex items-center justify-between mt-4">
          <div>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                v-model="rememberMe"
              />
              <span class="mx-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div>
            <a
              class="block text-sm text-indigo-700 fontme hover:underline"
              href="#"
            >Forgot your password?</a>
          </div>
        </div>

        <div v-if="error" class="mt-4 text-sm text-red-600">
          {{ error }}
        </div>

        <div class="mt-6">
          <button
            type="submit"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
            :disabled="isLoading"
          >
            <span v-if="isLoading">로그인 중...</span>
            <span v-else>로그인</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/auth';
import axios from '@/api/axiosInstance';

const router = useRouter();
const email = ref("admin@example.com");
const password = ref("admin123!");
const rememberMe = ref(false);
const error = ref("");
const isLoading = ref(false);

const authStore = useAuthStore();

async function login() {
  try {
    isLoading.value = true;
    error.value = "";

    if (!email.value || !password.value) {
      error.value = "이메일과 비밀번호를 입력해주세요.";
      return;
    }

    // JWT 인증 API 호출
    try {
      const response = await axios.post('/api/auth/login', {
        email: email.value,
        password: password.value
      });

      // JWT 토큰 추출
      const { accessToken, refreshToken, expiresIn } = response.data;
      
      if (accessToken) {
        // 토큰 및 사용자 정보 저장
        authStore.login({
          id: response.data.id || null,
          role: response.data.role || 'USER',
          username: response.data.username || email.value,
          userId: response.data.userId || response.data.id,
          email: email.value,
          accessToken,
          refreshToken,
          expiresIn
        });

        // 로그인 성공 시 로컬 스토리지에 이메일 저장 (rememberMe가 true인 경우)
        if (rememberMe.value) {
          localStorage.setItem('userEmail', email.value);
        } else {
          localStorage.removeItem('userEmail');
        }
        
        // 관리자인 경우 관리자 대시보드로, 일반 사용자는 메인 페이지로 리다이렉트
        if (authStore.isAdmin) {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
        error.value = "로그인에 실패했습니다. 응답에 토큰이 없습니다.";
      }
    } catch (apiError) {
      console.error('Login API error:', apiError);
      
      if (apiError.response) {
        // 서버에서 오류 응답이 온 경우
        if (apiError.response.status === 401) {
          error.value = "이메일 또는 비밀번호가 올바르지 않습니다.";
        } else if (apiError.response.data && apiError.response.data.message) {
          error.value = apiError.response.data.message;
        } else {
          error.value = `로그인 실패: ${apiError.response.status}`;
        }
      } else if (apiError.request) {
        // 요청은 보냈으나 응답이 없는 경우
        error.value = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
      } else {
        error.value = "로그인 요청을 생성하는 중 오류가 발생했습니다.";
      }
      
      // 백엔드 API가 없는 개발 환경을 위한 임시 로그인 처리
      if (process.env.NODE_ENV === 'development') {
        console.warn('개발 환경에서 임시 로그인 처리');
        
        // 임시 토큰 생성
        const mockToken = `mock_${Math.random().toString(36).substring(2)}`;
        const mockRefreshToken = `refresh_${Math.random().toString(36).substring(2)}`;
        
        // 관리자 계정으로 로그인
        if (email.value === 'admin@example.com' && password.value === 'admin123!') {
          authStore.login({
            id: 1,
            role: 'ADMIN',
            username: 'Admin User',
            userId: 'admin',
            email: email.value,
            accessToken: mockToken,
            refreshToken: mockRefreshToken,
            expiresIn: 3600
          });
          
          router.push("/admin/dashboard");
        } else {
          // 일반 사용자로 로그인
          authStore.login({
            id: 2,
            role: 'USER',
            username: 'Regular User',
            userId: 'user',
            email: email.value,
            accessToken: mockToken,
            refreshToken: mockRefreshToken,
            expiresIn: 3600
          });
          
          router.push("/");
        }
      }
    }
  } catch (err) {
    error.value = "로그인 중 오류가 발생했습니다.";
    console.error('Login error:', err);
  } finally {
    isLoading.value = false;
  }
}
</script>
