<script>
import api from '@/api/axiosInstance';

export default {
  data() {
    return {
      userId: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '';
      try {
        // 로그인 요청
        const response = await api.post('/api/auth/login', {
          userId: this.userId,
          password: this.password
        });

        // 응답에서 토큰 추출
        const { accessToken, refreshToken } = response.data;

        if (accessToken && refreshToken) {
          // 토큰 저장 (로컬스토리지 예시)
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          // 로그인 성공 후 페이지 이동
          this.$router.push('/');
        } else {
          this.errorMessage = '로그인 응답에 토큰이 없습니다.';
        }
      } catch (error) {
        // 에러 메시지 처리
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = '로그인에 실패했습니다.';
        }
      }
    }
  }
};
</script>

<template>
  <div>
    <input v-model="userId" placeholder="아이디" />
    <input v-model="password" type="password" placeholder="비밀번호" />
    <button @click="handleLogin">로그인</button>
    <div v-if="errorMessage" style="color:red;">{{ errorMessage }}</div>
  </div>
</template>