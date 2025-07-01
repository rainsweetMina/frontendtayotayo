<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold">✏️ 노선 정보 수정</h2>

    <!-- 🔧 기본 정보 수정 -->
    <div v-if="routeData">
      <div class="bg-white shadow rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block font-medium mb-1">노선 번호</label>
          <input v-model="routeData.routeNo" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block font-medium mb-1">노선 설명</label>
          <input v-model="routeData.routeNote" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block font-medium mb-1">정방향 설명</label>
          <input v-model="routeData.dirRouteNote" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block font-medium mb-1">역방향 설명</label>
          <input v-model="routeData.ndirRouteNote" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <button @click="updateRoute" class="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">💾 노선 저장</button>
    </div>

    <!-- 🗺️ 기존 정류소 목록 -->
    <div v-if="busStops.length > 0">
      <h3 class="text-lg font-semibold mt-6">정류소 목록</h3>
      <table class="w-full border text-sm mt-2">
        <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2">방향</th>
          <th class="px-4 py-2">Seq</th>
          <th class="px-4 py-2">정류소 ID</th>
          <th class="px-4 py-2">정류소 이름</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="stop in busStops" :key="`${stop.moveDir}-${stop.seq}`" class="text-center bg-white">
        <td class="py-2">{{ stop.moveDir === '1' ? '정방향' : '역방향' }}</td>
          <td>{{ stop.seq }}</td>
          <td>{{ stop.bsId }}</td>
          <td>{{ stop.bsNm || '-' }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- ➕ 정류소 추가 -->
    <div class="mt-8 bg-white shadow rounded-lg p-4">
      <h3 class="text-lg font-semibold mb-4">정류소 추가</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block font-medium mb-1">방향</label>
          <select v-model="newStop.moveDir" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="1">정방향</option>
            <option value="2">역방향</option>
          </select>
        </div>
        <div>
          <label class="block font-medium mb-1">정류소 ID</label>
          <input v-model="newStop.bsId" placeholder="예: 234000123" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block font-medium mb-1">순서 (seq)</label>
          <input v-model="newStop.seq" type="number" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <button @click="addStop" class="mt-4 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700">➕ 정류소 추가</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axiosInstance'

const route = useRoute()
const router = useRouter()

const routeId = route.params.routeId
const routeData = ref(null)
const busStops = ref([])
const newStop = ref({
  moveDir: '1',
  bsId: '',
  seq: ''
})

const loadRouteInfo = async () => {
  try {
    const res = await api.get('/api/bus/getRouteInfo', { params: { routeId } })
    routeData.value = res.data
  } catch {
    alert('❌ 노선 정보 로딩 실패')
  }

  try {
    const res = await api.get('/api/bus/bus-route', { params: { routeId } })
    busStops.value = res.data || []
  } catch {
    busStops.value = []
  }
}

const updateRoute = async () => {
  try {
    await api.put(`/api/bus/UpdateRouteUnified/${routeId}`, routeData.value)
    alert('✅ 노선 정보가 수정되었습니다.')
  } catch (e) {
    alert('❌ 수정 실패: ' + (e.response?.data?.message || e.message))
  }
}

const addStop = async () => {
  if (!newStop.value.bsId || !newStop.value.seq) {
    return alert('정류소 ID와 순서를 입력해주세요.')
  }

  const stopDto = {
    routeId,
    moveDir: newStop.value.moveDir,
    bsId: newStop.value.bsId,
    seq: parseInt(newStop.value.seq)
  }

  try {
    await api.post('/api/bus/InsertStop', stopDto)
    alert('✅ 정류소가 추가되었습니다.')
    newStop.value = { moveDir: '1', bsId: '', seq: '' }
    await loadRouteInfo()
  } catch (e) {
    alert('❌ 추가 실패: ' + (e.response?.data?.message || e.message))
  }
}

onMounted(() => {
  if (routeId) loadRouteInfo()
})
</script>
