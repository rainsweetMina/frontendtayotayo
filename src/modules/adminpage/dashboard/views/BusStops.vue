<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">정류장 관리</h1>
      <router-link
        to="/admin/bus-stops/add"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        정류장 추가
      </router-link>
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
            <option value="name">정류장 이름</option>
            <option value="address">주소</option>
            <option value="code">정류장 코드</option>
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
          <label for="status" class="block text-sm font-medium text-gray-700">상태</label>
          <select
            id="status"
            v-model="searchParams.status"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">전체</option>
            <option value="active">사용중</option>
            <option value="inactive">미사용</option>
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

    <!-- 정류장 목록 -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              정류장 코드
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              정류장명
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              주소
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              경유 노선
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
          <tr v-for="stop in stops" :key="stop.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ stop.code }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ stop.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ stop.address }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ stop.routeCount }}개 노선
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  stop.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ stop.status === 'active' ? '사용중' : '미사용' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link
                :to="`/admin/bus-stops/${stop.id}/edit`"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                수정
              </router-link>
              <button
                @click="handleToggleStatus(stop)"
                class="text-red-600 hover:text-red-900"
              >
                {{ stop.status === 'active' ? '미사용 처리' : '사용 처리' }}
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

const stops = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10

const searchParams = ref({
  type: 'name',
  keyword: '',
  status: ''
})

// 정류장 검색
const handleSearch = async (page = 1) => {
  try {
    const params = new URLSearchParams({
      page,
      type: searchParams.value.type,
      keyword: searchParams.value.keyword,
      status: searchParams.value.status
    })

    const response = await fetch(`/api/admin/bus-stops/search?${params}`)
    const data = await response.json()
    
    stops.value = data.stops
    totalPages.value = data.totalPages
    totalItems.value = data.totalItems
    currentPage.value = page
  } catch (error) {
    console.error('정류장 검색 실패:', error)
    alert('정류장 검색 중 오류가 발생했습니다.')
  }
}

// 페이지 변경
const handlePageChange = (page) => {
  if (page < 1 || page > totalPages.value) return
  handleSearch(page)
}

// 정류장 상태 토글
const handleToggleStatus = async (stop) => {
  if (!confirm(`정말 이 정류장을 ${stop.status === 'active' ? '미사용' : '사용'} 처리하시겠습니까?`)) return

  try {
    const response = await fetch(`/api/admin/bus-stops/${stop.id}/toggle-status`, {
      method: 'POST'
    })

    if (response.ok) {
      await handleSearch(currentPage.value)
    } else {
      const error = await response.json()
      alert(`상태 변경 실패: ${error.message}`)
    }
  } catch (error) {
    console.error('정류장 상태 변경 실패:', error)
    alert('정류장 상태 변경 중 오류가 발생했습니다.')
  }
}

onMounted(() => {
  handleSearch()
})
</script> 