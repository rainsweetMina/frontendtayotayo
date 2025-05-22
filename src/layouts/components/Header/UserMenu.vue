<template>

  <li v-if="!isAuthenticated" class="nav-item">
    <router-link to="/login" class="nav-link">회원가입(로그인)</router-link>
  </li>
  <li v-if="isUser" class="nav-item">
    <router-link to="/mypage" class="nav-link">마이페이지</router-link>
  </li>
  <li v-if="isAdmin" class="nav-item">
    <router-link to="/admin/dashboard" class="nav-link">관리자 페이지</router-link>
  </li>
  <li v-if="isAuthenticated" class="nav-item">
    <a class="nav-link" href="#" @click.prevent="logout">로그아웃</a>
  </li>
</template>

<script>
export default {
  props: {
    role: String
  },
  computed: {
    isAuthenticated() { return !!this.role },
    isUser() { return this.role === 'USER' },
    isAdmin() { return this.role === 'ADMIN' }
  },
  methods: {
    logout() {
      alert('로그아웃 처리 로직 필요')
    }
  }
}
</script>
