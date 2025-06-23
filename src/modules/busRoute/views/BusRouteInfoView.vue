<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold">🚌 노선 정류소 출력</h2>

    <!-- 🔍 검색 입력 -->
    <div>
      <label class="font-medium">노선 ID 입력:</label>
      <input v-model="routeIdInput" class="border px-2 py-1" placeholder="예: 36008429002" />
      <button @click="loadBusStops" class="ml-2 bg-blue-500 text-white px-4 py-1 rounded">불러오기</button>
    </div>

    <!-- 🧾 노선 정보 -->
    <div v-if="routeData">
      <h3 class="text-lg font-semibold">노선 정보</h3>
      <p><strong>노선 ID:</strong> {{ routeData.routeId }}</p>
      <p><strong>노선 번호:</strong> {{ routeData.routeNo }}</p>
      <p><strong>출발 정류소:</strong> {{ routeData.stNm }} ({{ routeData.stBsId }})</p>
      <p><strong>도착 정류소:</strong> {{ routeData.edNm }} ({{ routeData.edBsId }})</p>
      <p><strong>노선 설명:</strong> {{ routeData.routeNote }}</p>

      <div class="mt-4 flex gap-2">
        <button @click="confirmDeleteRoute" class="bg-red-600 text-white px-3 py-1 rounded">🚫 노선 삭제</button>
        <button @click="goToEditRoute" class="bg-orange-500 text-white px-3 py-1 rounded">✏️ 노선 정보 수정</button>
      </div>
    </div>

    <!-- 🗺️ 정류소 목록 -->
    <div v-if="busStops.length > 0">
      <h3 class="text-lg font-semibold mt-6">정류소 목록</h3>
      <table class="w-full border text-sm mt-2">
        <thead class="bg-gray-100">
        <tr>
          <th>seq</th>
          <th>방향</th>
          <th>정류소 ID</th>
          <th>정류소 이름</th>
          <th>좌표</th>
          <th>관리</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="stop in busStops" :key="`${stop.moveDir}-${stop.seq}`">
          <td>{{ stop.seq }}</td>
          <td>{{ stop.moveDir }}</td>
          <td>{{ stop.bsId }}</td>
          <td>{{ stop.bsNm || '-' }}</td>
          <td>{{ stop.xPos }}, {{ stop.yPos }}</td>
          <td>
            <span v-if="isProtectedStop(stop)">🔒 보호됨</span>
            <button
                v-else
                @click="deleteStop(stop.moveDir, stop.seq)"
                class="text-red-600 underline text-sm"
            >
              삭제
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="routeIdInput && !routeData">
      <p class="text-gray-500 mt-4">정류소 데이터가 없습니다.</p>
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

const loadBusStops = async () => {
  const id = routeIdInput.value.trim()
  if (!id) return alert('노선 ID를 입력해주세요.')

  try {
    const infoRes = await api.get('/api/bus/getRouteInfo', { params: { routeId: id } })
    routeData.value = infoRes.data
  } catch {
    routeData.value = null
    return alert('❌ 노선 정보가 없습니다.')
  }

  try {
    const stopRes = await api.get('/api/bus/bus-route', { params: { routeId: id } })
    busStops.value = stopRes.data || []
  } catch {
    alert('❌ 정류소 목록 조회 실패')
    busStops.value = []
  }
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
