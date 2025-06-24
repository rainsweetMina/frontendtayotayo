<template>
  <div class="max-w-xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
    <h2 class="text-2xl font-extrabold mb-8 flex items-center gap-2">
      <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      분실물 상세 정보
    </h2>
    <div class="grid grid-cols-1 gap-4 mb-8">
      <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">ID</div><div class="flex-1">{{ item.id }}</div></div>
      <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">물품명</div><div class="flex-1">{{ item.title }}</div></div>
      <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">버스 번호</div><div class="flex-1">{{ item.busNumber }}</div></div>
      <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">버스 회사</div><div class="flex-1">{{ item.busCompany }}</div></div>
      <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">신고자</div><div class="flex-1">{{ item.memberName }}</div></div>
      <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">삭제 여부</div><div class="flex-1"><span :class="item.deleted ? 'bg-red-100 text-red-700 px-2 py-1 text-xs font-medium rounded-full' : 'bg-green-100 text-green-700 px-2 py-1 text-xs font-medium rounded-full'">{{ item.deleted ? '삭제됨' : '정상' }}</span></div></div>
      <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">숨김 여부</div><div class="flex-1"><span :class="!item.visible ? 'bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full' : 'bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded-full'">{{ item.visible ? '보임' : '숨김' }}</span></div></div>
      <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">분실일</div><div class="flex-1">{{ formatDate(item.lostTime) }}</div></div>
      <div class="flex items-center gap-4"><div class="w-32 text-gray-500 font-semibold">내용</div><div class="flex-1">{{ item.content }}</div></div>
    </div>
    <div class="flex justify-end">
      <button class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold border border-gray-300 hover:bg-gray-200 transition flex items-center" @click="goList">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        목록
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLostItemDetailForAdmin } from '@/modules/lostFound/api/lostAdmin'

const route = useRoute()
const router = useRouter()
const item = ref({})

const fetchItem = async () => {
  const { data } = await getLostItemDetailForAdmin(route.params.id)
  item.value = data
}

const goList = () => {
  router.push('/admin/lost')
}

const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toLocaleString('ko-KR') : '-';
}

onMounted(fetchItem)
</script>
