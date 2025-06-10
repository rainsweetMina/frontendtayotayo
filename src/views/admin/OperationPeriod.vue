<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">운행기간 관리</h1>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="openCreateModal"
      >
        운행기간 추가
      </button>
    </div>

    <!-- 운행기간 목록 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              노선번호
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              시작일
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              종료일
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              운행시간
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
          <tr v-for="period in operationPeriods" :key="period.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ period.routeNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(period.startDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(period.endDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ period.operatingHours }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getPeriodStatusClass(period)
                ]"
              >
                {{ getPeriodStatusText(period) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex space-x-2">
                <button
                  class="text-blue-600 hover:text-blue-900"
                  @click="editPeriod(period)"
                >
                  수정
                </button>
                <button
                  class="text-red-600 hover:text-red-900"
                  @click="deletePeriod(period.id)"
                >
                  삭제
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
import { ref, onMounted } from 'vue'

// 상태 데이터
const operationPeriods = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

// 데이터 가져오기
const fetchOperationPeriods = async (page) => {
  try {
    const response = await fetch(`/api/admin/operation-periods?page=${page}`)
    const data = await response.json()
    operationPeriods.value = data.operationPeriods
    totalPages.value = data.totalPages
  } catch (error) {
    console.error('운행기간 데이터 로딩 실패:', error)
  }
}

// 페이지 변경
const changePage = (page) => {
  currentPage.value = page
  fetchOperationPeriods(page)
}

// 운행기간 추가 모달 열기
const openCreateModal = () => {
  // TODO: 운행기간 추가 모달 구현
}

// 운행기간 수정
const editPeriod = (period) => {
  // TODO: 운행기간 수정 모달 구현
}

// 운행기간 삭제
const deletePeriod = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    await fetch(`/api/admin/operation-periods/${id}`, {
      method: 'DELETE'
    })
    await fetchOperationPeriods(currentPage.value)
  } catch (error) {
    console.error('운행기간 삭제 실패:', error)
  }
}

// 운행기간 상태 클래스
const getPeriodStatusClass = (period) => {
  const now = new Date()
  const start = new Date(period.startDate)
  const end = new Date(period.endDate)

  if (now < start) {
    return 'bg-yellow-100 text-yellow-800' // 대기중
  } else if (now > end) {
    return 'bg-gray-100 text-gray-800' // 종료
  } else {
    return 'bg-green-100 text-green-800' // 운행중
  }
}

// 운행기간 상태 텍스트
const getPeriodStatusText = (period) => {
  const now = new Date()
  const start = new Date(period.startDate)
  const end = new Date(period.endDate)

  if (now < start) {
    return '대기중'
  } else if (now > end) {
    return '종료'
  } else {
    return '운행중'
  }
}

// 날짜 포맷
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchOperationPeriods(1)
})
</script> 