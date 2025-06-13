<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">신고된 분실물 관리</h1>
      <div class="flex space-x-4">
        <select
          v-model="status"
          class="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="all">전체</option>
          <option value="pending">처리중</option>
          <option value="found">발견</option>
          <option value="completed">처리완료</option>
        </select>
      </div>
    </div>

    <!-- 분실물 목록 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              신고일시
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              물품명
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              노선
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              관리
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in lostItems" :key="item.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDateTime(item.reportedAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.name"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ item.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ item.category }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.routeNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusClass(item.status)
                ]"
              >
                {{ getStatusText(item.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex space-x-2">
                <button
                  class="text-blue-600 hover:text-blue-900"
                  @click="viewDetails(item)"
                >
                  상세보기
                </button>
                <button
                  v-if="item.status === 'pending'"
                  class="text-green-600 hover:text-green-900"
                  @click="markAsFound(item)"
                >
                  발견처리
                </button>
                <button
                  v-if="item.status === 'found'"
                  class="text-green-600 hover:text-green-900"
                  @click="completeProcess(item)"
                >
                  처리완료
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="flex justify-center mt-6">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          이전
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          :class="[
            'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium',
            currentPage === page
              ? 'text-blue-600 border-blue-500'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          다음
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// 상태 데이터
const status = ref('all')
const lostItems = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

// 데이터 가져오기
const fetchLostItems = async (page) => {
  try {
    const response = await fetch(
      `/api/admin/lost-items/reported?page=${page}&status=${status.value}`
    )
    const data = await response.json()
    lostItems.value = data.lostItems
    totalPages.value = data.totalPages
  } catch (error) {
    console.error('분실물 데이터 로딩 실패:', error)
  }
}

// 페이지 변경
const changePage = (page) => {
  currentPage.value = page
  fetchLostItems(page)
}

// 상태에 따른 스타일 클래스
const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    found: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// 상태 텍스트
const getStatusText = (status) => {
  const texts = {
    pending: '처리중',
    found: '발견',
    completed: '처리완료'
  }
  return texts[status] || status
}

// 상세보기
const viewDetails = (item) => {
  // TODO: 상세보기 모달 구현
}

// 발견 처리
const markAsFound = async (item) => {
  try {
    await fetch(`/api/admin/lost-items/${item.id}/found`, {
      method: 'POST'
    })
    await fetchLostItems(currentPage.value)
  } catch (error) {
    console.error('발견 처리 실패:', error)
  }
}

// 처리 완료
const completeProcess = async (item) => {
  try {
    await fetch(`/api/admin/lost-items/${item.id}/complete`, {
      method: 'POST'
    })
    await fetchLostItems(currentPage.value)
  } catch (error) {
    console.error('처리 완료 실패:', error)
  }
}

// 날짜/시간 포맷
const formatDateTime = (date) => {
  return new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 상태 변경 시 데이터 다시 로드
watch(status, () => {
  currentPage.value = 1
  fetchLostItems(1)
})

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchLostItems(1)
})
</script> 