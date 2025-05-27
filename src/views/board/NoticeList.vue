<template>
  <div>
    <h2>공지사항 목록</h2>
    <ul>
      <li v-for="n in notices" :key="n.id">
        <router-link :to="`/notices/${n.id}`">{{ n.title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '@/api/notice';
const notices = ref([]);

onMounted(async () => {
  const res = await api.getAll();
  notices.value = res.data;
});
</script>
