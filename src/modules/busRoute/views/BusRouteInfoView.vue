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
      <div class="mt-4 flex gap-2">
        <button @click="confirmDeleteRoute" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">🚫 노선 삭제</button>
        <button @click="goToEditRoute" class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">✏️ 노선 수정</button>
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
          <th class="px-4 py-2 text-left text-gray-500">좌표</th>
          <th class="px-4 py-2 text-left text-gray-500">관리</th>
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
          <td class="px-4 py-2">{{ stop.xPos }}, {{ stop.yPos }}</td>
          <td class="px-4 py-2">
            <span v-if="isProtectedStop(stop)" class="text-gray-400">🔒 보호됨</span>
            <button
                v-else
                @click="deleteStop(stop.moveDir, stop.seq)"
                class="text-red-600 underline hover:text-red-800"
            >삭제</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isSearched && !isLoading && notFound" class="text-gray-500 mt-4">
      ⚠️ 노선 정보를 찾을 수 없습니다.
    </div>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axiosInstance'

const route = useRoute()
const router = useRouter()

const routeIdInput = ref('')
const routeData = ref(null)
const busStops = ref([])
const searched = ref(false)
const isLoading  = ref(false)
const notFound  = ref(false)

const loadBusStops = async () => {
  const id = routeIdInput.value.trim()
  if (!id) return alert('노선 ID를 입력해주세요.')

  // 초기화
  searched.value  = true
  isLoading.value = true
  notFound.value  = false
  routeData.value = null
  busStops.value  = []

  /* ① 노선 정보 조회 */
  try {
    const { data } = await api.get('/api/bus/getRouteInfo', { params: { routeId: id } })
    routeData.value = data
  } catch {
    // 실패 → notFound 플래그만 올리고 함수 종료
    notFound.value  = true
    isLoading.value = false
    return
  }

  /* ② 정류소 목록 조회 (노선 정보를 찾은 경우에만) */
  try {
    const { data } = await api.get('/api/bus/bus-route', { params: { routeId: id } })
    busStops.value = data || []
  } catch {
    alert('❌ 정류소 목록 조회 실패')
  }

  isLoading.value = false
}

const isProtectedStop = (stop) => {
  const sameDir = busStops.value.filter(s => s.moveDir === stop.moveDir)
  const seqs = sameDir.map(s => s.seq)
  const min = Math.min(...seqs)
  const max = Math.max(...seqs)
  return stop.seq === min || stop.seq === max
}

const deleteStop = async (moveDir, seq) => {
  const id = routeIdInput.value.trim()
  if (!confirm(`정류소 ${seq}번 (${moveDir === '1' ? '정방향' : '역방향'})을 삭제하시겠습니까?`)) return

  try {
    await api.delete('/api/bus/delete-stop', { params: { routeId: id, moveDir, seq } })
    alert('✅ 삭제 완료!')
    await loadBusStops()
  } catch (e) {
    alert('❌ 삭제 실패: ' + (e.response?.data?.message || e.message))
  }
}

const confirmDeleteRoute = async () => {
  const id = routeIdInput.value.trim()
  if (!id) return alert('노선 ID를 입력해주세요.')

  if (!confirm(`정말로 노선 ${id}를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return

  try {
    await api.delete('/api/bus/deleteRoute', { params: { routeId: id } })
    alert('✅ 노선이 삭제되었습니다.')
    routeData.value = null
    busStops.value = []
    routeIdInput.value = ''
  } catch (e) {
    alert('❌ 노선 삭제 실패: ' + (e.response?.data?.message || e.message))
  }
}

const goToEditRoute = () => {
  if (!routeData.value?.routeId) return alert('노선 정보가 없습니다.')
  router.push(`/bus/route/info/${routeData.value.routeId}`)
}

onMounted(() => {
  const routeId = route.query.routeId || route.params.routeId
  if (routeId) {
    routeIdInput.value = routeId
    loadBusStops()
  }
})
</script>
