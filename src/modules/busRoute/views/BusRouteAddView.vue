<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4 text-blue-700">➕ 버스 노선 추가하기</h2>

    <!-- 노선 입력 폼 -->
    <form @submit.prevent="submitRoute" class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <input v-model="route.routeId" placeholder="추가할 노선 ID" required class="input" />
        <input v-model="route.routeNo" placeholder="추가할 노선 번호" required class="input" />
        <input v-model="route.stBsId" @input="fetchStopName('st')" placeholder="출발 정류소 ID" required class="input" />
        <input :value="route.stNm" disabled placeholder="출발 정류소명" class="input bg-gray-100" />
        <input v-model="route.edBsId" @input="fetchStopName('ed')" placeholder="도착 정류소 ID" required class="input" />
        <input :value="route.edNm" disabled placeholder="도착 정류소명" class="input bg-gray-100" />
        <input v-model="route.routeNote" placeholder="노선 설명" class="input col-span-2" />
        <input v-model="route.dataconnareacd" placeholder="데이터 연결 여부" class="input" />
        <input v-model="route.routeTCd" placeholder="노선 타입 코드" class="input" />
        <input v-model="route.dirRouteNote" placeholder="정방향 설명" class="input col-span-2" />
        <input v-model="route.ndirRouteNote" placeholder="역방향 설명" class="input col-span-2" />
      </div>

      <!-- 정방향 경유 정류장 -->
      <div>
        <h3 class="text-lg font-semibold mb-2">▶ 정방향 경유 정류장</h3>
        <div v-for="(stop, i) in stopsForward" :key="i" class="flex gap-2 items-center mb-2">
          <input v-model="stop.bsId" @input="fetchStopNameInList('forward', i)" placeholder="정류장 ID" class="input" />
          <input :value="stop.name" disabled placeholder="정류소명" class="input bg-gray-100" />
          <button type="button" @click="removeStop('forward', i)" class="text-red-600">삭제</button>
        </div>
        <button type="button" @click="addStop('forward')" class="text-blue-600 mt-1">+ 정방향 추가</button>
      </div>

      <!-- 역방향 경유 정류장 -->
      <div>
        <h3 class="text-lg font-semibold mb-2">◀ 역방향 경유 정류장</h3>
        <div v-for="(stop, i) in stopsBackward" :key="i" class="flex gap-2 items-center mb-2">
          <input v-model="stop.bsId" @input="fetchStopNameInList('backward', i)" placeholder="정류장 ID" class="input" />
          <input :value="stop.name" disabled placeholder="정류소명" class="input bg-gray-100" />
          <button type="button" @click="removeStop('backward', i)" class="text-red-600">삭제</button>
        </div>
        <button type="button" @click="addStop('backward')" class="text-blue-600 mt-1">+ 역방향 추가</button>
      </div>

      <div>
        <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">노선 등록</button>
      </div>
    </form>

    <!-- ✅ BaseModal -->
    <BaseModal :show="modal.show" :message="modal.message" @close="modal.show = false" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '@/api/axiosInstance'
import BaseModal from '@/modules/mypage/components/BaseModal.vue'   // ✅

/* ── 모달 상태 & 헬퍼 ───────────────────────────── */
const modal = reactive({ show: false, message: '' })
const openModal = msg => { modal.message = msg; modal.show = true }

/* ── 상태 ──────────────────────────────────────── */
const searchKeyword = ref('')
const route = ref({
  routeId: '', routeNo: '', stBsId: '', edBsId: '',
  stNm: '', edNm: '', routeNote: '', dataconnareacd: 'Y',
  dirRouteNote: '', ndirRouteNote: '', routeTCd: ''
})

const stopsForward  = ref([])
const stopsBackward = ref([])

/* ── 정류소 추가/삭제 ───────────────────────────── */
const addStop = dir => {
  const list = dir === 'forward' ? stopsForward.value : stopsBackward.value
  list.push({ bsId: '', name: '', moveDir: dir === 'forward' ? '1' : '0' })
}
const removeStop = (dir, idx) => {
  const list = dir === 'forward' ? stopsForward.value : stopsBackward.value
  list.splice(idx, 1)
}

/* ── 정류소명 조회 ──────────────────────────────── */
const fetchStopName = async type => {
  const bsId = type === 'st' ? route.value.stBsId : route.value.edBsId
  if (!bsId) return
  try {
    const { data } = await api.get('/api/bus/stop-name', { params: { bsId } })
    if (type === 'st') route.value.stNm = data
    else route.value.edNm = data
  } catch { /* 무시 */ }
}
const fetchStopNameInList = async (dir, idx) => {
  const list = dir === 'forward' ? stopsForward.value : stopsBackward.value
  const bsId = list[idx].bsId
  if (!bsId) return
  try {
    const { data } = await api.get('/api/bus/stop-name', { params: { bsId } })
    list[idx].name = data
  } catch { /* 무시 */ }
}

/* ── (선택) 정류소 검색 예시 ────────────────────── */
const searchBus = () => {
  if (!searchKeyword.value) return openModal('검색어를 입력하세요.')   // ✅
  api.get('/api/bus/searchBSorBN', { params: { keyword: searchKeyword.value } })
      .then(res => console.log('검색 결과:', res.data))
}

/* ── 노선 등록 ─────────────────────────────────── */
const submitRoute = async () => {
  const payload = {
    route: route.value,
    stopsForward:  stopsForward.value.map(s => ({ bsId: s.bsId, moveDir: '1' })),
    stopsBackward: stopsBackward.value.map(s => ({ bsId: s.bsId, moveDir: '0' }))
  }
  try {
    await api.post('/api/bus/AddBusRoute', payload)
    openModal('✅ 노선이 성공적으로 추가되었습니다!')               // ✅
    // 필요하다면 입력값 초기화
  } catch (e) {
    openModal('❌ 오류 발생: ' + (e.response?.data?.message || e.message)) // ✅
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  box-sizing: border-box;
}
</style>