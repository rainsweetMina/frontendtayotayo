<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        전체 정류장 목록
      </h1>
    </div>

    <!-- 검색 필터 -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <input
          type="text"
          v-model="searchParams.keyword"
          class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="정류장 ID 또는 이름 검색"
          @keyup.enter="handleSearch"
        />
        <button
          type="button"
          class="ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="handleSearch"
        >
          검색
        </button>
      </div>
    </div>

    <!-- 정류장 목록 -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              정류장 ID
            </th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              정류장 이름
            </th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              경도 (X)
            </th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              위도 (Y)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="stop in busStops" 
            :key="stop.bsId" 
            class="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            @click="goToStopDetail(stop.bsId)"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
              {{ stop.bsId }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
              {{ stop.bsNm }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
              {{ (stop.xPos !== undefined && stop.xPos !== null) ? stop.xPos : (stop.xpos !== undefined && stop.xpos !== null ? stop.xpos : '정보 없음') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
              {{ (stop.yPos !== undefined && stop.yPos !== null) ? stop.yPos : (stop.ypos !== undefined && stop.ypos !== null ? stop.ypos : '정보 없음') }}
            </td>
          </tr>
          <tr v-if="busStops.length === 0">
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
              검색 결과가 없습니다.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <div class="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200">
        <div class="flex items-center" v-if="totalPages > 0">
          <button
            @click="handlePageChange(1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 rounded-l-md"
          >
            처음
          </button>
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50"
          >
            이전
          </button>
          <div class="flex items-center">
            <button
              v-for="page in paginationButtons"
              :key="page"
              @click="handlePageChange(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : page === '...'
                    ? 'bg-white border-gray-300 text-gray-500 cursor-default'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              ]"
              :disabled="page === '...'"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50"
          >
            다음
          </button>
          <button
            @click="handlePageChange(totalPages)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 rounded-r-md"
          >
            마지막
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAllBusStops } from '@/api/busStop'

const router = useRouter()
const busStops = ref([])
const currentPage = ref(1)
const totalPages = ref(0)
const totalItems = ref(0)
const itemsPerPage = 10

const searchParams = ref({
  keyword: '',
})

// 정류장 상세 정보 페이지로 이동
const goToStopDetail = (bsId) => {
  // 백엔드 URL 형식에 맞게 설정
  router.push(`/admin/bus-stops/${bsId}`)
}

// 페이지네이션 버튼 계산
const paginationButtons = computed(() => {
  const buttons = []
  const maxButtons = 5 // 최대 버튼 수

  if (totalPages.value <= 0) {
    return buttons;
  }

  if (totalPages.value <= maxButtons) {
    // 전체 페이지가 최대 버튼 수보다 적으면 모든 페이지 표시
    for (let i = 1; i <= totalPages.value; i++) {
      buttons.push(i)
    }
  } else {
    // 현재 페이지 주변의 버튼만 표시
    const halfMaxButtons = Math.floor(maxButtons / 2)
    let startPage = Math.max(1, currentPage.value - halfMaxButtons)
    let endPage = Math.min(totalPages.value, startPage + maxButtons - 1)
    
    // 마지막 페이지가 최대 버튼 수보다 작으면 시작 페이지 조정
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i)
    }
  }

  return buttons
})

// 정류장 검색
const handleSearch = async (page = 1) => {
  try {
    // 유효한 페이지 번호인지 확인
    const validPage = parseInt(page) || 1;
    
    // API 호출 시 페이지는 0부터 시작하므로 1을 빼줍니다
    const result = await getAllBusStops(searchParams.value.keyword, validPage - 1, itemsPerPage)
    
    // 백엔드 응답 구조에 맞게 데이터 매핑
    busStops.value = result.content || []
    totalPages.value = result.totalPages || 0
    totalItems.value = result.totalElements || 0
    currentPage.value = validPage
  } catch (error) {
    console.error('정류장 검색 실패:', error)
    alert('정류장 검색 중 오류가 발생했습니다.')
    
    // 오류 발생 시 기본 상태로 초기화
    busStops.value = []
    totalPages.value = 0
    totalItems.value = 0
    currentPage.value = 1
  }
}

// 페이지 변경
const handlePageChange = (page) => {
  // 페이지가 숫자가 아니거나 범위를 벗어나면 무시
  if (typeof page !== 'number' || isNaN(page) || page < 1 || page > totalPages.value) return
  handleSearch(page)
}

onMounted(() => {
  handleSearch(1)
})
</script> 