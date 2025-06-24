<template>
  <div class="w-full px-0 py-8">
    <div class="flex justify-between items-center mb-8 px-8">
      <h2 class="text-3xl font-extrabold">등록된 광고 목록</h2>
      <router-link
          to="/admin/ad/create"
          class="px-6 py-2 bg-blue-600 text-white text-lg rounded-lg font-semibold shadow hover:bg-blue-700 transition"
      >광고 등록</router-link>
    </div>
    <div class="bg-white shadow-lg rounded-xl overflow-x-auto w-full">
      <table class="w-full text-base">
        <thead>
        <tr class="bg-gray-100">
          <th class="py-3 px-4 font-bold text-gray-700 text-center">ID</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">이미지</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-left">제목</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">광고회사</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">상태</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">연장횟수</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">시작일</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">종료일</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">액션</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="ad in adList"
            :key="ad.id"
            class="border-b hover:bg-blue-50 transition cursor-pointer"
            @click="openDetail(ad)"
        >
          <td class="py-3 px-4 text-center font-mono">{{ ad.id }}</td>
          <td class="py-2 px-4 flex justify-center items-center">
            <img
                v-if="ad.imageUrl"
                :src="`${IMAGE_BASE_URL}/ad/${ad.imageUrl}`"
                alt="광고 이미지"
                class="w-80 h-20 object-cover rounded-lg shadow"
                style="min-width: 320px; min-height: 80px;"
            />
            <span v-else class="text-gray-400">-</span>
          </td>
          <td class="py-2 px-4 font-semibold truncate">{{ ad.title }}</td>
          <td class="py-2 px-4 text-center">{{ ad.companyName }}</td>
          <td class="py-2 px-4 text-center">
            <span
                :class="[
                'inline-block rounded-full px-3 py-1 text-sm font-bold',
                ad.status === 'ONGOING'
                  ? 'bg-green-100 text-green-700'
                  : ad.status === 'SCHEDULED'
                  ? 'bg-yellow-100 text-yellow-700'
                  : ad.status === 'ENDING_SOON'
                  ? 'bg-orange-100 text-orange-700'
                  : ad.status === 'ENDED'
                  ? 'bg-gray-200 text-gray-500'
                  : ad.status === 'DELETED'
                  ? 'bg-red-100 text-red-500'
                  : 'bg-gray-100 text-gray-400'
              ]"
            >
              {{ statusText(ad.status) }}
            </span>
          </td>
          <td class="py-2 px-4 text-center">{{ ad.extensionCount }}회</td>
          <td class="py-2 px-4 text-center">{{ formatDate(ad.startDateTime) }}</td>
          <td class="py-2 px-4 text-center">{{ formatDate(ad.endDateTime) }}</td>
          <td class="py-2 px-4">
            <div class="flex justify-center items-center gap-2">
              <button
                  class="px-4 py-1 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200 hover:bg-blue-100 transition"
                  @click.stop="goEdit(ad.id)"
              >수정</button>
              <button
                  class="px-4 py-1 rounded bg-green-50 text-green-700 font-semibold border border-green-200 hover:bg-green-100 transition"
                  @click.stop="goExtend(ad.id)"
              >연장</button>
              <button
                  class="px-4 py-1 rounded bg-red-50 text-red-700 font-semibold border border-red-200 hover:bg-red-100 transition"
                  @click.stop="handleDelete(ad.id)"
              >삭제</button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 광고 상세 팝업 -->
    <div v-if="detailAd" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          @click="closeDetail"
          aria-label="닫기"
        >&times;</button>
        <img :src="`${IMAGE_BASE_URL}/ad/${detailAd.imageUrl}`" alt="광고" class="w-full rounded mb-4" />
        <div class="mb-2"><b>제목:</b> {{ detailAd.title }}</div>
        <div class="mb-2"><b>링크:</b> <a :href="detailAd.linkUrl" target="_blank" class="text-blue-600 underline">{{ detailAd.linkUrl }}</a></div>
        <div class="mb-2"><b>기간:</b> {{ formatDate(detailAd.startDateTime) }} ~ {{ formatDate(detailAd.endDateTime) }}</div>
        <div class="mb-2"><b>광고회사:</b> {{ detailAd.companyName }}</div>
        <div class="flex gap-2 mt-4">
          <button class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" @click="goEdit(detailAd.id)">수정</button>
          <button class="px-4 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700" @click="goExtend(detailAd.id)">연장</button>
          <button class="px-4 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700" @click="handleDelete(detailAd.id)">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAds, deleteAd } from '@/modules/ad/api/adApi.js'
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL

const router = useRouter()
const adList = ref([])

const detailAd = ref(null)
const openDetail = (ad) => { detailAd.value = ad }
const closeDetail = () => { detailAd.value = null }

const fetchData = async () => {
  try {
    adList.value = await fetchAds()
  } catch (e) {
    alert('광고 목록을 불러올 수 없습니다.')
  }
}

// 수정 버튼 클릭 이벤트
const goEdit = (id) => {
  router.push({ name: 'AdminAdEdit', params: { id } })
}
const goExtend = (id) => {
  router.push({ name: 'AdminAdExtend', params: { id } })
}
const handleDelete = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try { await deleteAd(id); await fetchData(); alert('삭제되었습니다.'); closeDetail(); }
  catch (e) { alert('삭제에 실패했습니다.') }
}

const statusText = (status) => {
  switch (status) {
    case 'SCHEDULED': return '예정'
    case 'ONGOING': return '진행중'
    case 'ENDING_SOON': return '종료임박'
    case 'ENDED': return '종료됨'
    case 'DELETED': return '삭제됨'
    default: return status
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return date.length > 10 ? date.slice(0, 10) : date
}

onMounted(fetchData)
</script>
