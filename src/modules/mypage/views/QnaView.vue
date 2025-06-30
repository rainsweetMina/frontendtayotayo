<template>
  <div class="page-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">내 Q&A 목록</h1>
      <p class="text-xs text-gray-500 mt-1">
        ※ 관리자가 숨김 또는 삭제한 Q&A는 목록에 보이지 않습니다.
      </p>
    </div>
    <div v-if="sortedQnaList.length" class="content-card">
      <div v-for="q in sortedQnaList" :key="q.id" class="qna-card border-b last:border-b-0 p-6 cursor-pointer hover:bg-gray-50 transition"
           @click="toggleDetail(q.id)">
        <div class="flex justify-between items-center">
          <div class="font-bold text-lg">
            <span v-if="q.secret">🔒 </span>{{ q.title }}
          </div>
          <div class="text-sm text-gray-500">{{ formatDate(q.createdAt) }}</div>
        </div>
        <div class="flex justify-between items-center mt-2">
          <span class="text-xs text-gray-400">{{ statusLabelMap[q.status] || q.status }}</span>
        </div>
        <div v-if="selectedId === q.id && selectedQna" class="mt-4 bg-gray-50 rounded p-4">
          <div class="mb-2"><strong>질문 내용</strong><br />{{ selectedQna.content }}</div>
          <div v-if="selectedQna.answer && selectedQna.answer.trim() !== ''">
            <strong>관리자 답변</strong><br />{{ selectedQna.answer }}
          </div>
          <div v-else class="text-gray-400 italic">답변이 등록되지 않았습니다.</div>
        </div>
      </div>
    </div>
    <div v-else class="content-card p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">등록된 Q&A가 없습니다</h3>
      <p class="mt-1 text-sm text-gray-500">새로운 Q&A를 등록해보세요.</p>
    </div>
  </div>
  <router-link to="/mypage" class="back-button">← 마이페이지로 돌아가기</router-link>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axiosInstance'

const qnaList = ref([])
const selectedId = ref(null)
const selectedQna = ref(null)
const statusLabelMap = {
  WAITING: '답변 대기',
  ANSWERED: '답변 완료',
  HIDDEN: '숨김 처리'
}
const sortedQnaList = computed(() => {
  return [...qnaList.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

})

async function toggleDetail(id) {
  if (selectedId.value === id) {
    selectedId.value = null
    selectedQna.value = null
  } else {
    try {
      const res = await api.get(`/api/qna/${id}`)
      selectedQna.value = res.data
      selectedId.value = id
    } catch (e) {
      console.error('❌ Q&A 상세 조회 실패', e)
    }
  }
}

async function fetchQnaList() {
  try {
    const res = await api.get('/api/qna/list')
    qnaList.value = res.data
  } catch (e) {
    console.error('❌ Q&A 목록 로딩 실패', e)
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`
}

onMounted(fetchQnaList)
</script>

<style scoped>
.mypage-main {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}
.qna-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.qna-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}
.qna-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}
.qna-card:hover {
  background-color: #f9f9f9;
}
.qna-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.qna-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
}
.qna-detail-expanded {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #ccc;
}
.qna-content,
.qna-answer {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  white-space: pre-wrap;
}
.qna-answer-empty {
  color: #888;
  font-style: italic;
  margin-top: 0.5rem;
}
.status.waiting {
  color: #e67e22;
}
.status.answered {
  color: #3498db;
}
.empty-message {
  text-align: center;
  color: #aaa;
  margin-top: 2rem;
}
.button-group {
  display: flex;
  gap: 6px;
}
.btn {
  border: none;
  padding: 4px 10px;
  font-size: 0.85rem;
  border-radius: 6px;
  cursor: pointer;
}
.btn-edit {
  background-color: #eef4ff;
  color: #0d6efd;
}
.btn-delete {
  background-color: #ffeef0;
  color: #dc3545;
}
.back-button {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 50;
  padding: 14px 28px;
  background-color: #2563eb;
  color: #fff;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 1.05rem;
  box-shadow: 0 4px 16px rgba(37,99,235,0.13);
  transition: background 0.2s, color 0.2s, transform 0.15s;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}
.back-button:hover {
  background-color: #1d4ed8;
  color: #fff;
  transform: scale(1.06);
}
</style>
