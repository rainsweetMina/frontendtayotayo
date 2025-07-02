<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">🚌 노선 상세 정보</h2>

    <!-- 🔍 검색 입력 -->
    <div class="bg-white shadow rounded-lg p-4 flex items-center">
      <label class="mr-2 font-medium">노선 ID:</label>
      <input
          v-model="routeIdInput"
          @keyup.enter="loadBusStops"
          class="flex-1 border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="노선 ID를 입력하세요. 예 : 1000001000"
      />
      <button
          @click="loadBusStops"
          class="ml-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >노선 검색</button>
    </div>

    <!-- 🧾 노선 정보 -->
    <div v-if="routeData" class="bg-white shadow rounded-lg p-4">
      <h3 class="text-lg font-semibold text-gray-700">노선 정보</h3>
      <div class="mt-2 space-y-1 text-gray-600">
        <p><strong>노선 ID:</strong> {{ routeData.routeId }}</p>
        <p><strong>노선 번호:</strong> {{ routeData.routeNo }}</p>
        <p><strong>출발 정류소:</strong> {{ routeData.stNm }} ({{ routeData.stBsId }})</p>
        <p><strong>도착 정류소:</strong> {{ routeData.edNm }} ({{ routeData.edBsId }})</p>
        <p><strong>노선 설명:</strong> {{ routeData.routeNote }}</p>
      </div>
      <div class="mt-4">
        <button
            @click="goToEditRoute"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >노선 수정</button>
      </div>
    </div>

    <!-- 🗺️ 정류소 목록 -->
    <div v-if="busStops.length > 0" class="bg-white shadow rounded-lg">
      <h3 class="text-lg font-semibold p-4 border-b">정류소 목록</h3>
      <table class="min-w-full text-sm">
        <thead class="bg-white-50 border-b">
        <tr>
          <th class="px-4 py-2 text-left text-gray-500">순번</th>
          <th class="px-4 py-2 text-left text-gray-500">방향</th>
          <th class="px-4 py-2 text-left text-gray-500">정류소 ID</th>
          <th class="px-4 py-2 text-left text-gray-500">정류소 이름</th>
          <th class="px-4 py-2 text-left text-gray-500">정류소 좌표</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="stop in busStops"
            :key="`${stop.moveDir}-${stop.seq}`"
            class="bg-white hover:bg-gray-50 border-b"
        >
          <td class="px-4 py-2">{{ stop.seq }}</td>
          <td class="px-4 py-2">{{ stop.moveDir === '1' ? '정방향' : '역방향' }}</td>
          <td class="px-4 py-2">{{ stop.bsId }}</td>
          <td class="px-4 py-2">{{ stop.bsNm || '-' }}</td>
          <td class="px-4 py-2">
            {{ Number(stop.xPos).toFixed(2) }}, {{ Number(stop.yPos).toFixed(2) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isSearched && !isLoading && notFound" class="text-gray-500 mt-4">
      ⚠️ 노선 정보를 찾을 수 없습니다.
    </div>

    <!-- 🔙 하단 중앙 정렬 버튼 -->
    <div class="text-center mt-6">
      <router-link
          to="/bus/route/all"
          class="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition duration-200"
      >
        ← 전체 노선 리스트
      </router-link>
    </div>

    <!-- BaseModal -->
    <BaseModal :show="modal.show" :message="modal.message" @close="modal.show = false" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axiosInstance'
import BaseModal from '@/modules/mypage/components/BaseModal.vue'

const route = useRoute()
const router = useRouter()

const routeIdInput = ref('')
const routeData    = ref(null)
const busStops     = ref([])
const searched     = ref(false)
const isLoading    = ref(false)
const notFound     = ref(false)

const modal = reactive({ show: false, message: '' })
const openModal = msg => { modal.message = msg; modal.show = true }

const loadBusStops = async () => {
  const id = routeIdInput.value.trim()
  if (!id) return openModal('노선 ID를 입력해주세요.')

  searched.value = true
  isLoading.value = true
  notFound.value  = false
  routeData.value = null
  busStops.value  = []

  try {
    const { data } = await api.get('/api/bus/getRouteInfo', { params: { routeId: id } })
    routeData.value = data
  } catch {
    notFound.value  = true
    isLoading.value = false
    return
  }

  try {
    const { data } = await api.get('/api/bus/bus-route', { params: { routeId: id } })
    busStops.value = data || []
  } catch {
    openModal('❌ 정류소 목록 조회 실패')
  }

  isLoading.value = false
}

const goToEditRoute = () => {
  if (!routeData.value?.routeId) return openModal('노선 정보가 없습니다.')
  router.push(`/bus/route/edit/${routeData.value.routeId}`)
}

onMounted(() => {
  const routeId = route.query.routeId || route.params.routeId
  if (routeId) {
    routeIdInput.value = routeId
    loadBusStops()
  }
})
</script>
