<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">등록된 습득물 관리</h1>
      <div class="flex space-x-4">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="openCreateModal"
        >
          습득물 등록
        </button>
      </div>
    </div>

    <!-- 습득물 목록 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일시</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">물품명</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">노선</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in foundItems" :key="item.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDateTime(item.foundTime) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ item.itemName }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ item.busNumber || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusClass(item.status)]">
                {{ getStatusText(item.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex space-x-2">
                <button class="text-blue-600 hover:text-blue-900" @click="editItem(item)">수정</button>
                <button class="text-green-600 hover:text-green-900" @click="handleMatch(item.id)">매칭</button>
                <button class="text-yellow-600 hover:text-yellow-900" @click="handleHide(item.id)">숨김</button>
                <button class="text-red-600 hover:text-red-900" @click="handleDelete(item.id)">삭제</button>
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
import { getFoundItemsForAdmin, hideFoundItem, deleteFoundItem, matchFoundItem } from '@/api/foundAdmin'

const foundItems = ref([])

const fetchFoundItems = async () => {
  try {
    const res = await getFoundItemsForAdmin()
    foundItems.value = res.data
  } catch (err) {
    console.error('습득물 목록 로딩 실패:', err)
  }
}

const handleHide = async (id) => {
  if (!confirm('정말로 숨기시겠습니까?')) return
  try {
    await hideFoundItem(id)
    fetchFoundItems()
  } catch (err) {
    console.error('숨김 실패:', err)
  }
}

const handleDelete = async (id) => {
  if (!confirm('정말로 삭제하시겠습니까?')) return
  try {
    await deleteFoundItem(id)
    fetchFoundItems()
  } catch (err) {
    console.error('삭제 실패:', err)
  }
}

const handleMatch = async (id) => {
  const lostItemId = prompt('매칭할 분실물 ID를 입력하세요')
  if (!lostItemId) return
  try {
    await matchFoundItem(id, lostItemId)
    fetchFoundItems()
  } catch (err) {
    console.error('매칭 실패:', err)
  }
}

const editItem = (item) => {
  // TODO: 수정 모달 연결
  console.log('수정 클릭:', item)
}

const openCreateModal = () => {
  // TODO: 등록 모달 연결
  console.log('등록 모달 열기')
}

const getStatusClass = (status) => {
  const classes = {
    STORED: 'bg-blue-100 text-blue-800',
    RETURNED: 'bg-green-100 text-green-800',
    DISCARDED: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    STORED: '보관중',
    RETURNED: '반환완료',
    DISCARDED: '폐기'
  }
  return texts[status] || status
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(fetchFoundItems)
</script>