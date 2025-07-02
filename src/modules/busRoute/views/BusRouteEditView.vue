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

      <div class="mt-4 flex gap-2">
        <button @click="updateRoute" class="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">노선 저장</button>
        <button @click="confirmDeleteRoute" class="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700">노선 삭제</button>
      </div>
    </div>

    <!-- 🗺️ 정류소 목록 -->
    <div v-if="busStops.length > 0">
      <h3 class="text-lg font-semibold mt-6">정류소 목록</h3>
      <table class="w-full border text-sm mt-2">
        <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2">방향</th>
          <th class="px-4 py-2">Seq</th>
          <th class="px-4 py-2">정류소 ID</th>
          <th class="px-4 py-2">정류소 이름</th>
          <th class="px-4 py-2">관리</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="stop in busStops" :key="`${stop.moveDir}-${stop.seq}`" class="text-center bg-white">
          <td class="py-2">{{ stop.moveDir === '1' ? '정방향' : '역방향' }}</td>
          <td>{{ stop.seq }}</td>
          <td>{{ stop.bsId }}</td>
          <td>{{ stop.bsNm || '-' }}</td>
          <td>
            <span v-if="isProtectedStop(stop)" class="text-gray-400">🔒 보호됨</span>
            <button
                v-else
                @click="deleteStop(stop.moveDir, stop.seq)"
                class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              삭제
            </button>
          </td>
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

    <!-- 🔙 하단 중앙 버튼들 -->
    <div class="text-center mt-8 space-x-2">
      <button
          @click="goBack"
          class="inline-block px-5 py-2 bg-gray-700 text-white text-sm font-medium rounded-md shadow hover:bg-gray-800 transition"
      >
        ← 노선 상세 정보
      </button>
      <!-- 전체 노선 목록 (진회색) -->
      <router-link
          to="/bus/route/all"
          class="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition"
      >
        ← 전체 노선 목록
      </router-link>
    </div>

    <BaseModal :show="modal.show" :message="modal.message" @close="modal.show = false" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axiosInstance'
import BaseModal from '@/modules/mypage/components/BaseModal.vue'

/* ── 모달 ── */
const modal = reactive({ show: false, message: '' })
const openModal = msg => { modal.message = msg; modal.show = true }

/* ── 라우터 & 상태 ── */
const route   = useRoute()
const router  = useRouter()
const routeId = route.params.routeId

const routeData = ref(null)
const busStops  = ref([])
const newStop   = ref({ moveDir: '1', bsId: '', seq: '' })

/* ── 데이터 로딩 ── */
const loadRouteInfo = async () => {
  try {
    const { data } = await api.get('/api/bus/getRouteInfo', { params: { routeId } })
    routeData.value = data
  } catch { openModal('❌ 노선 정보 로딩 실패') }

  try {
    const { data } = await api.get('/api/bus/bus-route', { params: { routeId } })
    busStops.value = data || []
  } catch { busStops.value = [] }
}

/* ── 보호 정류소 판단 ── */
const isProtectedStop = stop => {
  const sameDir = busStops.value.filter(s => s.moveDir === stop.moveDir)
  const seqs = sameDir.map(s => s.seq)
  return stop.seq === Math.min(...seqs) || stop.seq === Math.max(...seqs)
}

/* ── 정류소 삭제 ── */
const deleteStop = async (moveDir, seq) => {
  if (!confirm(`정류소 ${seq}번 (${moveDir === '1' ? '정방향' : '역방향'})을 삭제하시겠습니까?`)) return
  try {
    await api.delete('/api/bus/delete-stop', { params: { routeId, moveDir, seq } })
    openModal('✅ 정류소가 삭제되었습니다.')
    await loadRouteInfo()
  } catch (e) {
    openModal('❌ 삭제 실패: ' + (e.response?.data?.message || e.message))
  }
}

/* ── 노선 삭제 ── */
const confirmDeleteRoute = async () => {
  if (!confirm(`정말로 노선 ${routeId}를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return
  try {
    await api.delete('/api/bus/deleteRoute', { params: { routeId } })
    openModal('✅ 노선이 삭제되었습니다.')
    router.push('/bus/route/all')
  } catch (e) {
    openModal('❌ 노선 삭제 실패: ' + (e.response?.data?.message || e.message))
  }
}

/* ── 노선 수정 ── */
const updateRoute = async () => {
  try {
    await api.put(`/api/bus/UpdateRouteUnified/${routeId}`, routeData.value)
    openModal('✅ 노선 정보가 수정되었습니다.')
  } catch (e) {
    openModal('❌ 수정 실패: ' + (e.response?.data?.message || e.message))
  }
}

/* ── 정류소 추가 ── */
const addStop = async () => {
  if (!newStop.value.bsId || !newStop.value.seq) return openModal('정류소 ID와 순서를 입력해주세요.')
  try {
    await api.post('/api/bus/InsertStop', {
      routeId, moveDir: newStop.value.moveDir, bsId: newStop.value.bsId, seq: parseInt(newStop.value.seq)
    })
    openModal('✅ 정류소가 추가되었습니다.')
    newStop.value = { moveDir: '1', bsId: '', seq: '' }
    await loadRouteInfo()
  } catch (e) {
    openModal('❌ 추가 실패: ' + (e.response?.data?.message || e.message))
  }
}

/* ── 이전 페이지로 이동 ── */
const goBack = () => router.back()

onMounted(() => { loadRouteInfo() })
</script>
