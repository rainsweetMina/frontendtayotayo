<template>
  <div class="mypage-main">
    <div class="qna-header">
      <h2>📋 내 Q&A 목록</h2>
    </div>

    <ul class="qna-list">
      <li
          v-for="q in sortedQnaList"
          :key="q.id"
          class="qna-card"
          @click="toggleDetail(q.id)"
      >
        <div class="qna-title">
          <span v-if="q.secret">🔒 </span>{{ q.title }}
        </div>
        <div class="qna-meta">
          <span class="status" :class="q.status.toLowerCase()">{{ statusLabelMap[q.status] || q.status }}</span>
          <span class="date">{{ formatDate(q.createdAt) }}</span>
        </div>

        <!-- 상세내용 -->
        <div v-if="selectedId === q.id && selectedQna" class="qna-detail-expanded">
          <div class="qna-content">
            <strong>📄 질문 내용</strong><br />
            {{ selectedQna.content }}
          </div>
          <div v-if="selectedQna.answer && selectedQna.answer.trim() !== ''" class="qna-answer">
            <strong>💡 관리자 답변</strong><br />
            {{ selectedQna.answer }}
          </div>
          <div v-else class="qna-answer-empty">답변이 등록되지 않았습니다.</div>
        </div>
      </li>
    </ul>

    <div v-if="qnaList.length === 0" class="empty-message">등록된 질문이 없습니다.</div>
  </div>
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
    console.log('🔥 응답 데이터:', res.data)
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
</style>
