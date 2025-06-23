<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">🚌 전체 노선 목록</h2>

    <input v-model="keyword" placeholder="노선ID 또는 노선번호로 검색" class="border px-2 py-1 mr-2" />
    <button @click="fetchRoutes(0)" class="bg-blue-600 text-white px-4 py-1 rounded">검색</button>

    <table class="w-full border mt-4 text-sm">
      <thead class="bg-gray-100">
      <tr>
        <th class="cursor-pointer" @click="toggleSort">노선 ID ⬍</th>
        <th>노선 번호</th>
        <th>출발 정류장</th>
        <th>도착 정류장</th>
        <th>비고</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="route in routes" :key="route.routeId" @click="goToInfo(route.routeId)" class="cursor-pointer hover:bg-gray-100">
        <td>{{ route.routeId }}</td>
        <td>{{ route.routeNo }}</td>
        <td>{{ route.stNm }}</td>
        <td>{{ route.edNm }}</td>
        <td>{{ route.routeNote || '-' }}</td>
      </tr>
      </tbody>
    </table>

    <div class="mt-4 flex gap-1 flex-wrap">
      <button v-if="groupStart > 0" @click="fetchRoutes(groupStart - 1)">이전</button>
      <button
          v-for="i in pagesToShow"
          :key="i"
          :disabled="i === page"
          @click="fetchRoutes(i)"
      >
        {{ i + 1 }}
      </button>
      <button v-if="groupEnd < totalPages" @click="fetchRoutes(groupEnd)">다음</button>
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
  const res = await api.get('/api/bus/routes', {
    params: { keyword: keyword.value, page: p, size, sort: sortDirection.value }
  })
  routes.value = res.data.content
  page.value = res.data.number
  totalPages.value = res.data.totalPages
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
