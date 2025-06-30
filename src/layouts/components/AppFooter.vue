<template>
  <div class="w-full border-t-2 px-8 py-3 lg:flex justify-between items-center">
    <p class="mb-2 lg:mb-0">© Copyright {{ currentYear }}</p>

    <div class="flex">
      <router-link to="/terms" class="mr-6 hover:text-gray-900">이용약관</router-link>
      <router-link to="/privacy" class="mr-6 hover:text-gray-900">개인정보처리방침</router-link>
      <a href="#" class="hover:text-gray-900">회사 소개</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const currentYear = ref(new Date().getFullYear());
</script>
