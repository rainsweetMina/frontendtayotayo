<template>
  <a class="navbar-brand" href="/main">
    <img src="/images/logo.png" alt="logo" class="logo-image">
  </a>
</template>
<script setup lang="ts">
</script>

<style scoped>
.navbar-brand {
  margin-right: 1.5rem;
  padding: 0.5rem 0;
  line-height: 1;
  display: flex;
  align-items: center;
  flex-shrink: 0; /* 로고가 축소되지 않도록 설정 */
}

.logo-image {
  width: 90px;
  height: 45px;
  min-width: 90px; /* 최소 너비 설정 */
  object-fit: contain;
}

/* 모바일 화면에서도 로고 크기 유지 */
@media (max-width: 768px) {
  .logo-image {
    width: 90px;
    height: 45px;
  }
}
</style>