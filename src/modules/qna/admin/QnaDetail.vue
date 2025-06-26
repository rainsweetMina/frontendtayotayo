<template>
  <div class="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-8">
    <h2 class="text-2xl font-bold mb-4">QnA 상세</h2>
    <div v-if="qna">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xl font-bold">{{ qna.title }}</span>
        <span v-if="qna.deleted" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold" style="background:#f87171;color:#fff;">🗑️ 삭제됨</span>
        <span v-else-if="!qna.visible" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold" style="background:#a3a3a3;color:#fff;">👁️‍🗨️ 숨김</span>
        <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold" style="background:#34d399;color:#fff;">✅ 정상</span>
      </div>
      <div v-if="qna.deleted" class="mb-4 p-3 bg-red-50 text-red-700 rounded font-bold text-center">삭제된 게시글입니다. (내용 확인만 가능)</div>
      <div class="mb-2"><b>작성자:</b> {{ qna.username || '-' }}</div>
      <div class="mb-2"><b>작성일:</b> {{ formatDate(qna.createdAt) }}</div>
      <div class="mb-4"><b>내용:</b><br />{{ qna.content }}</div>
      <div v-if="qna.answer" class="bg-blue-50 p-4 rounded mb-2">
        <b>답변</b><br />
        {{ qna.answer }}
      </div>
      <div v-else class="text-gray-400 mb-2">아직 답변이 등록되지 않았습니다.</div>
      <div class="flex gap-2 mt-6">
        <button v-if="!qna.deleted" @click="handleHide" class="px-4 py-1 rounded bg-yellow-50 text-yellow-700 font-semibold border border-yellow-200 hover:bg-yellow-100 transition">숨김</button>
        <button v-if="!qna.deleted" @click="handleDelete" class="px-4 py-1 rounded bg-red-50 text-red-700 font-semibold border border-red-200 hover:bg-red-100 transition">삭제</button>
        <router-link v-if="qna.answer && !qna.deleted" :to="`/admin/qna/${qna.id}/edit`" class="px-4 py-1 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200 hover:bg-blue-100 transition">답변수정</router-link>
        <router-link v-if="!qna.answer && !qna.deleted" :to="`/admin/qna/${qna.id}/answer`" class="px-4 py-1 rounded bg-green-50 text-green-700 font-semibold border border-green-200 hover:bg-green-100 transition">답변</router-link>
      </div>
      <button class="mt-4 px-4 py-2 bg-gray-100 rounded border" @click="goList">목록으로</button>
    </div>
    <div v-else class="text-center text-gray-400">로딩 중...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const qna = ref(null)

const fetchQna = async () => {
  try {
    const res = await axios.get(`/api/qna/${route.params.id}`)
    qna.value = res.data
  } catch (e) {
    alert('QnA 정보를 불러올 수 없습니다.')
    router.push('/admin/qna')
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return date.length > 10 ? date.slice(0, 10) : date
}

const goList = () => router.push('/admin/qna')

const handleHide = async () => {
  if (!confirm('정말 숨기시겠습니까?')) return
  try {
    await axios.patch(`/api/qna/admin/hide/${qna.value.id}`)
    alert('숨김 처리되었습니다.')
    await fetchQna()
  } catch (e) {
    alert('숨김 처리에 실패했습니다.')
  }
}

const handleDelete = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await axios.delete(`/api/qna/admin/${qna.value.id}`)
    alert('삭제되었습니다.')
    router.push('/admin/qna')
  } catch (e) {
    alert('삭제에 실패했습니다.')
  }
}

onMounted(fetchQna)
</script> 