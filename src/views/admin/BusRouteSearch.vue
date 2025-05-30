<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">노선 조회</h1>
    </div>

    <!-- 검색 필터 -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label for="searchType" class="block text-sm font-medium text-gray-700">검색 유형</label>
          <select
            id="searchType"
            v-model="searchParams.type"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="routeNumber">노선 번호</option>
            <option value="routeName">노선명</option>
            <option value="company">운수 회사</option>
          </select>
        </div>
        <div>
          <label for="searchKeyword" class="block text-sm font-medium text-gray-700">검색어</label>
          <input
            type="text"
            id="searchKeyword"
            v-model="searchParams.keyword"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @keyup.enter="handleSearch"
          />
        </div>
        <div>
          <label for="routeType" class="block text-sm font-medium text-gray-700">노선 유형</label>
          <select
            id="routeType"
            v-model="searchParams.routeType"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">전체</option>
            <option value="일반">일반</option>
            <option value="급행">급행</option>
            <option value="심야">심야</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="handleSearch"
        >
          검색
        </button>
      </div>
    </div>

    <!-- 검색 결과 -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              노선 번호
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              노선명
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              유형
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              운수 회사
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              운행 시간
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              작업
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="route in routes" :key="route.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ route.routeNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ route.routeName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ route.routeType }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ route.company }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ route.firstBus }} - {{ route.lastBus }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  route.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ route.status === 'active' ? '운행중' : '운행중지' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link
                :to="`/admin/bus-routes/${route.id}/edit`"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                수정
              </router-link>
              <button
                @click="handleToggleStatus(route)"
                class="text-red-600 hover:text-red-900"
              >
                {{ route.status === 'active' ? '운행중지' : '운행재개' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            이전
          </button>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            다음
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              전체 <span class="font-medium">{{ totalItems }}</span> 건 중
              <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> -
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span> 건
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="handlePageChange(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const routes = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10

const searchParams = ref({
  type: 'routeNumber',
  keyword: '',
  routeType: ''
})

// 노선 검색
const handleSearch = async (page = 1) => {
  try {
    const params = new URLSearchParams({
      page,
      type: searchParams.value.type,
      keyword: searchParams.value.keyword,
      routeType: searchParams.value.routeType
    })

    const response = await fetch(`/api/admin/bus-routes/search?${params}`)
    const data = await response.json()
    
    routes.value = data.routes
    totalPages.value = data.totalPages
    totalItems.value = data.totalItems
    currentPage.value = page
  } catch (error) {
    console.error('노선 검색 실패:', error)
    alert('노선 검색 중 오류가 발생했습니다.')
  }
}

// 페이지 변경
const handlePageChange = (page) => {
  if (page < 1 || page > totalPages.value) return
  handleSearch(page)
}

// 노선 상태 토글
const handleToggleStatus = async (route) => {
  if (!confirm(`정말 이 노선을 ${route.status === 'active' ? '운행중지' : '운행재개'} 하시겠습니까?`)) return

  try {
    const response = await fetch(`/api/admin/bus-routes/${route.id}/toggle-status`, {
      method: 'POST'
    })

    if (response.ok) {
      await handleSearch(currentPage.value)
    } else {
      const error = await response.json()
      alert(`상태 변경 실패: ${error.message}`)
    }
  } catch (error) {
    console.error('노선 상태 변경 실패:', error)
    alert('노선 상태 변경 중 오류가 발생했습니다.')
  }
}

onMounted(() => {
  handleSearch()
})
</script> 