<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold">✏️ 노선 정보 수정</h2>

    <!-- 🔧 기본 정보 수정 -->
    <div v-if="routeData">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="font-semibold">노선 번호</label>
          <input v-model="routeData.routeNo" class="border px-2 py-1 w-full" />
        </div>
        <div>
          <label class="font-semibold">노선 설명</label>
          <input v-model="routeData.routeNote" class="border px-2 py-1 w-full" />
        </div>
        <div>
          <label class="font-semibold">정방향 설명</label>
          <input v-model="routeData.dirRouteNote" class="border px-2 py-1 w-full" />
        </div>
        <div>
          <label class="font-semibold">역방향 설명</label>
          <input v-model="routeData.ndirRouteNote" class="border px-2 py-1 w-full" />
        </div>
      </div>

      <button @click="updateRoute" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded">💾 노선 저장</button>
    </div>

    <!-- 🗺️ 기존 정류소 목록 -->
    <div v-if="busStops.length > 0">
      <h3 class="text-lg font-semibold mt-6">정류소 목록</h3>
      <table class="w-full border text-sm mt-2">
        <thead class="bg-gray-100">
        <tr>
          <th>방향</th>
          <th>Seq</th>
          <th>정류소 ID</th>
          <th>정류소 이름</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="stop in busStops" :key="`${stop.moveDir}-${stop.seq}`">
          <td>{{ stop.moveDir === '1' ? '정방향' : '역방향' }}</td>
          <td>{{ stop.seq }}</td>
          <td>{{ stop.bsId }}</td>
          <td>{{ stop.bsNm || '-' }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- ➕ 정류소 추가 -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold">정류장 추가</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div>
          <label class="font-semibold">방향</label>
          <select v-model="newStop.moveDir" class="border px-2 py-1 w-full">
            <option value="1">정방향</option>
            <option value="2">역방향</option>
          </select>
        </div>
        <div>
          <label class="font-semibold">정류소 ID</label>
          <input v-model="newStop.bsId" placeholder="예: 234000123" class="border px-2 py-1 w-full" />
        </div>
        <div>
          <label class="font-semibold">순서(seq)</label>
          <input v-model="newStop.seq" type="number" class="border px-2 py-1 w-full" />
        </div>
      </div>
      <button @click="addStop" class="mt-3 bg-green-600 text-white px-4 py-2 rounded">➕ 정류소 추가</button>
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
