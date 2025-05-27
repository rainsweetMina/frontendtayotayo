<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout.vue'

export default {
  name: 'App',
  components: { DefaultLayout }
}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100vw; /* ✅ 뷰포트 전체 너비를 강제로 사용 */
  max-width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  box-sizing: border-box;
}
</style>