<template>
  <DefaultLayout v-if="layout !== 'none'">
    <router-view />
  </DefaultLayout>
  <router-view v-else />
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import DefaultLayout from './layouts/DefaultLayout.vue'

const route = useRoute()
const layout = computed(() => route.meta.layout || 'default') // 기본값은 'default'
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  box-sizing: border-box;
}
</style>
