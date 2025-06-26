<template>
  <div class="w-full max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">QnA 답변 수정</h2>
    <div v-if="loading" class="text-center py-12 text-gray-500">로딩 중...</div>
    <div v-else>
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <div class="mb-2"><b>질문 제목:</b> {{ qna.title }}</div>
        <div class="mb-2"><b>질문:</b> {{ qna.question }}</div>
        <div class="mb-2"><b>내용:</b> {{ qna.content }}</div>
        <div class="mb-2"><b>작성자:</b> {{ qna.userName }}</div>
        <div class="mb-2"><b>작성일:</b> {{ formatDate(qna.createdAt) }}</div>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block mb-1 font-semibold">답변</label>
          <textarea v-model="answer" rows="6" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" required placeholder="답변을 입력하세요"></textarea>
        </div>
        <div class="flex gap-2">
          <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">저장</button>
          <router-link to="/admin/qna" class="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition">취소</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const qna = ref({})
const answer = ref('')
const loading = ref(true)

const fetchQna = async () => {
  try {
    const res = await axios.get(`/api/qna/${route.params.id}`)
    qna.value = res.data
    answer.value = res.data.answer || ''
    loading.value = false
  } catch (e) {
    alert('QnA 정보를 불러올 수 없습니다.')
    router.push('/admin/qna')
  }
}

const handleSubmit = async () => {
  try {
    await axios.put(`/api/qna/${route.params.id}/answer`, { answer: answer.value })
    alert('답변이 수정되었습니다.')
    router.push('/admin/qna')
  } catch (e) {
    alert('답변 수정에 실패했습니다.')
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return date.length > 10 ? date.slice(0, 10) : date
}

onMounted(fetchQna)
</script> 