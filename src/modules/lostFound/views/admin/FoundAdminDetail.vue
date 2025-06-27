<template>
  <div class="max-w-xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-extrabold flex items-center gap-2">
        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        습득물 상세 정보
      </h2>
      <div class="flex gap-2">
        <button @click="goToEditPage" :disabled="authStore.role !== 'BUS'" class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17v4h4l11-11a2.828 2.828 0 10-4-4L3 17z" /></svg>
          수정
        </button>
        <button @click="goBack" class="px-4 py-1 rounded bg-gray-100 text-gray-700 font-semibold border border-gray-300 hover:bg-gray-200 transition flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          목록으로
        </button>
      </div>
    </div>
    <div v-if="item">
      <div class="flex flex-col items-center mb-8">
        <img v-if="item.photoUrl" :src="`${IMAGE_BASE_URL}/found/${item.photoUrl}`" alt="등록된 이미지" class="w-64 h-40 object-cover rounded-xl shadow border mb-2 ring-2 ring-blue-200" />
        <div v-else class="w-64 h-40 flex items-center justify-center bg-gray-100 rounded-xl text-gray-400 mb-2">이미지 없음</div>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">물품명</div><div class="flex-1">{{ item.itemName || '-' }}</div></div>
        <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">버스 회사</div><div class="flex-1">{{ item.busCompany || '-' }}</div></div>
        <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">노선 번호</div><div class="flex-1">{{ item.busNumber || '-' }}</div></div>
        <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">습득 위치</div><div class="flex-1">{{ item.foundPlace || '-' }}</div></div>
        <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">습득일</div><div class="flex-1">{{ formatDate(item.foundTime) }}</div></div>
        <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">연락처</div><div class="flex-1">{{ item.handlerContact || '-' }}</div></div>
        <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">이메일</div><div class="flex-1">{{ item.handlerEmail || '-' }}</div></div>
        <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">처리 상태</div><div class="flex-1"><span :class="getStatusClass(item.status)">{{ statusLabel(item.status) }}</span></div></div>
        <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">보관 장소</div><div class="flex-1">{{ item.storageLocation || '-' }}</div></div>
        <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">내용</div><div class="flex-1">{{ item.content || '-' }}</div></div>
        <div v-if="item.isDeleted || item.deleted" class="text-red-600 font-bold">(삭제됨)</div>
        <div v-else-if="item.visible === false" class="text-blue-800 font-bold">(숨김됨)</div>
      </div>
    </div>
    <div v-else class="py-10 text-center">
      <div v-if="loading" class="flex justify-center">
        <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
      </div>
      <p v-else class="text-gray-400">정보를 찾을 수 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const item = ref(null)
const loading = ref(true)
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || '';
const authStore = useAuthStore()

const goBack = () => {
  router.push('/admin/found')
}

const goToEditPage = () => {
  router.push(`/admin/found/edit/${route.params.id}`)
}

const fetchItem = async () => {
  try {
    loading.value = true
    const { data } = await axios.get(`/api/admin/found/${route.params.id}`)
    item.value = data
  } catch (error) {
    console.error('습득물 상세 정보 조회 실패:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}

const statusLabel = (status) => {
  const map = {
    IN_STORAGE: '보관중',
    RETURNED: '수령완료'
  }
  return map[status] || status
}

const getStatusClass = (status) => {
  const map = {
    IN_STORAGE: 'bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full',
    RETURNED: 'bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full'
  }
  return map[status] || 'bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded-full'
}

onMounted(() => {
  fetchItem()
})
</script>

<style scoped>
.container {
  max-width: 900px;
}

th {
  width: 30%;
  background-color: #f8f9fa;
}

td {
  white-space: pre-wrap;
}
</style>
