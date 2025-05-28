<template>
  <section class="notice-board">
    <h1 class="notice-title">📢 공지사항</h1>
    <div v-for="notice in notices" :key="notice.id" class="notice-card">
      <h2>{{ notice.title }}</h2>
      <p class="notice-date">{{ formatDate(notice.date) }}</p>
      <p class="notice-content">{{ notice.content }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const notices = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('/api/notice')
    notices.value = res.data
  } catch (err) {
    console.error('공지사항 로딩 실패', err)
  }
})

const formatDate = (isoDate) => {
  const d = new Date(isoDate)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.notice-board {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.notice-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2c3e50;
}

.notice-card {
  border-left: 4px solid #3498db;
  background: #f4f8fb;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.notice-card:hover {
  background: #e8f2fb;
}

.notice-date {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

.notice-content {
  font-size: 1rem;
  color: #34495e;
}
</style>
