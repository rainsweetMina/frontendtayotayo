<template>
  <div>
    <div class="d-flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">등록된 광고 목록</h2>
      <router-link to="/admin/ad/create" class="btn btn-primary">
        광고 등록
      </router-link>
    </div>
    <div class="bg-white shadow rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
        <tr>
          <th>ID</th>
          <th>이미지</th>
          <th>제목</th>
          <th>광고회사</th>
          <th>상태</th>
          <th>연장횟수</th>
          <th>시작일</th>
          <th>종료일</th>
          <th>액션</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="ad in adList" :key="ad.id">
          <td>{{ ad.id }}</td>
          <td>
            <img
                v-if="ad.imageUrl"
                :src="`${IMAGE_BASE_URL}/ad/${ad.imageUrl}`"
                alt="광고 이미지"
                style="width: 80px; height: 40px; object-fit: cover;"
            />
            <span v-else class="text-gray-400">-</span>
          </td>
          <td>{{ ad.title }}</td>
          <td>{{ ad.companyName }}</td>
          <td>{{ statusText(ad.status) }}</td>
          <td>{{ ad.extensionCount }}회</td>
          <td>{{ formatDate(ad.startDateTime) }}</td>
          <td>{{ formatDate(ad.endDateTime) }}</td>
          <td>
            <button class="btn btn-outline-primary btn-sm mr-2" @click.stop="goEdit(ad.id)">수정</button>
            <button class="btn btn-outline-secondary btn-sm mr-2" @click.stop="goExtend(ad.id)">연장</button>
            <button class="btn btn-outline-danger btn-sm" @click.stop="handleDelete(ad.id)">삭제</button>
          </td>
        </tr>
        </tbody>
      </table>
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

const fetchData = async () => {
  try {
    adList.value = await fetchAds()
  } catch (e) {
    alert('광고 목록을 불러올 수 없습니다.')
  }
}

const goEdit = (id) => {
  router.push({ name: 'AdEdit', params: { id } })
}

const goExtend = (id) => {
  router.push({ name: 'AdExtend', params: { id } })
}

const handleDelete = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await deleteAd(id)
    await fetchData()
    alert('삭제되었습니다.')
  } catch (e) {
    alert('삭제에 실패했습니다.')
  }
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
