<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">등록된 습득물 관리</h1>
      <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="goToCreatePage"
      >
        습득물 등록
      </button>
    </div>

    <!-- ✅ 목록 테이블 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사진</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">물품명</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">습득일</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr
            v-for="item in foundItems"
            :key="item.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="goToDetailPage(item.id)"
        >
          <td class="px-4 py-3 text-sm text-gray-500">{{ item.id }}</td>
          <td class="px-4 py-3">
            <img v-if="item.photoUrl" :src="`${IMAGE_BASE_URL}/found/${item.photoUrl}`" alt="사진" class="w-12 h-12 object-cover rounded" />
            <span v-else class="text-gray-400 text-sm">-</span>
          </td>
          <td class="px-4 py-3">{{ item.itemName }}</td>
          <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(item.foundTime) }}</td>
          <td class="px-4 py-3">
              <span :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </span>
          </td>
          <td class="px-4 py-3 text-sm">
            <div class="flex space-x-2" @click.stop>
              <button class="text-blue-600 hover:underline" @click="goToDetailPage(item.id)">상세</button>
              <button class="text-green-600 hover:underline" @click="goToEditPage(item.id)">수정</button>
              <button class="text-yellow-600 hover:underline" @click="matchItem(item)">매칭</button>
              <button class="text-gray-600 hover:underline" @click="hideItem(item)">숨김</button>
              <button class="text-red-600 hover:underline" @click="deleteItem(item)">삭제</button>
            </div>
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
import { getFoundItemsForAdmin } from '@/modules/lostFound/api/foundAdmin'

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;


const router = useRouter()
const foundItems = ref([])

const fetchFoundItems = async () => {
  try {
    const { data } = await getFoundItemsForAdmin()
    foundItems.value = data
  } catch (error) {
    console.error('습득물 목록 조회 실패:', error)
  }
}

const goToCreatePage = () => {
  router.push('/admin/found/create')
}

const goToDetailPage = (id) => {
  router.push(`/admin/found/${id}`)
}

const goToEditPage = (id) => {
  router.push(`/admin/found/edit/${id}`)
}

const matchItem = (item) => {
  // TODO: 매칭 페이지로 이동
}

const hideItem = async (item) => {
  // TODO: 숨김 API 연동
}

const deleteItem = async (item) => {
  // TODO: 삭제 API 연동
}

const getStatusText = (status) => {
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

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

onMounted(() => {
  fetchFoundItems()
})
</script>
