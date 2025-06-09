<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">버스 노선 관리</h1>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="openCreateModal"
      >
        노선 추가
      </button>
    </div>

    <!-- 버스 노선 목록 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              노선번호
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              출발지
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              도착지
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
          <tr v-for="route in busRoutes" :key="route.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ route.routeNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ route.startLocation }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ route.endLocation }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ route.operatingHours }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  route.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ route.isActive ? '운행중' : '운행중지' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex space-x-2">
                <button
                  class="text-blue-600 hover:text-blue-900"
                  @click="editRoute(route)"
                >
                  수정
                </button>
                <button
                  class="text-red-600 hover:text-red-900"
                  @click="deleteRoute(route.id)"
                >
                  삭제
                </button>
                <button
                  :class="[
                    route.isActive
                      ? 'text-red-600 hover:text-red-900'
                      : 'text-green-600 hover:text-green-900'
                  ]"
                  @click="toggleRouteStatus(route)"
                >
                  {{ route.isActive ? '운행중지' : '운행시작' }}
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
const busRoutes = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

// 데이터 가져오기
const fetchBusRoutes = async (page) => {
  try {
    const response = await fetch(`/api/admin/bus-routes?page=${page}`)
    const data = await response.json()
    busRoutes.value = data.busRoutes
    totalPages.value = data.totalPages
  } catch (error) {
    console.error('버스 노선 데이터 로딩 실패:', error)
  }
}

// 페이지 변경
const changePage = (page) => {
  currentPage.value = page
  fetchBusRoutes(page)
}

// 노선 추가 모달 열기
const openCreateModal = () => {
  // TODO: 노선 추가 모달 구현
}

// 노선 수정
const editRoute = (route) => {
  // TODO: 노선 수정 모달 구현
}

// 노선 삭제
const deleteRoute = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    await fetch(`/api/admin/bus-routes/${id}`, {
      method: 'DELETE'
    })
    await fetchBusRoutes(currentPage.value)
  } catch (error) {
    console.error('노선 삭제 실패:', error)
  }
}

// 노선 상태 토글
const toggleRouteStatus = async (route) => {
  try {
    await fetch(`/api/admin/bus-routes/${route.id}/toggle`, {
      method: 'POST'
    })
    await fetchBusRoutes(currentPage.value)
  } catch (error) {
    console.error('노선 상태 변경 실패:', error)
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchBusRoutes(1)
})
</script> 