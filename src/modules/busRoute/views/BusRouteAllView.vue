<template>
  <div>
    <!-- 헤더 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">전체 노선 목록</h1>
    </div>

    <!-- 검색 필터 -->
    <div class="bg-white shadow rounded-lg p-4 mb-6 flex items-center">
      <input
          v-model="keyword"
          @keyup.enter="fetchRoutes(0)"
          type="text"
          placeholder="노선 ID 또는 노선 번호 검색"
          class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      <button
          type="button"
          class="ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="fetchRoutes(0)"
      >
        검색
      </button>
    </div>

    <!-- 노선 목록 테이블 -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th
              class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              @click="toggleSort"
          >
            노선 ID
            <span class="ml-1">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">노선 번호</th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">출발 정류장</th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">도착 정류장</th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">비고</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="route in routes"
            :key="route.routeId"
            class="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            @click="goToInfo(route.routeId)"
        >
          <td class="px-6 py-4 whitespace-nowrap text-center text-gray-900">{{ route.routeId }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center text-gray-500">{{ route.routeNo }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center text-gray-500">{{ route.stNm }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center text-gray-500">{{ route.edNm }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center text-gray-500">{{ route.routeNote || '-' }}</td>
        </tr>
        <tr v-if="routes.length === 0">
          <td colspan="5" class="px-6 py-4 text-center text-gray-500">검색 결과가 없습니다.</td>
        </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <div class="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200" v-if="totalPages > 0">
        <button
            @click="fetchRoutes(0)"
            :disabled="page === 0"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 rounded-l-md"
        >처음</button>
        <button
            @click="fetchRoutes(page - 1)"
            :disabled="page === 0"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50"
        >이전</button>

        <button
            v-for="p in pagesToShow"
            :key="p"
            @click="fetchRoutes(p)"
            :class="[
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
            p === page
              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          ]"
        >
          {{ p + 1 }}
        </button>

        <button
            @click="fetchRoutes(page + 1)"
            :disabled="page + 1 >= totalPages"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50"
        >다음</button>
        <button
            @click="fetchRoutes(totalPages - 1)"
            :disabled="page + 1 >= totalPages"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 rounded-r-md"
        >마지막</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axiosInstance'

const keyword = ref('')
const routes = ref([])
const page = ref(0)
const totalPages = ref(0)
const sortDirection = ref('asc')
const size = 10

const fetchRoutes = async (p = 0) => {
  try {
    const res = await api.get('/api/bus/routes', {
      params: {
        keyword: keyword.value,
        page: p,
        size,
        sort: sortDirection.value
      }
    })
    routes.value = res.data.content
    page.value = res.data.number
    totalPages.value = res.data.totalPages
  } catch (err) {
    console.error('노선 조회 실패:', err)
    routes.value = []
    page.value = 0
    totalPages.value = 0
  }
}

const toggleSort = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  fetchRoutes(0)
}

const pageGroupSize = 10
const groupStart = computed(() => Math.floor(page.value / pageGroupSize) * pageGroupSize)
const groupEnd = computed(() => Math.min(groupStart.value + pageGroupSize, totalPages.value))
const pagesToShow = computed(() => {
  const arr = []
  for (let i = groupStart.value; i < groupEnd.value; i++) arr.push(i)
  return arr
})

const router = useRouter()
const goToInfo = (routeId) => router.push(`/bus/route/info/${routeId}`)

fetchRoutes()
</script>
