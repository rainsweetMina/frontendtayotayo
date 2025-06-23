<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">➕ 버스 노선 추가하기</h2>

    <div class="mb-4">
      <label>정류장 또는 노선 검색: </label>
      <input v-model="searchKeyword" placeholder="예: 623, 동성로" class="border px-2 py-1" />
      <button @click="searchBus" class="ml-2 bg-blue-500 text-white px-3 py-1 rounded">검색</button>
    </div>

    <form @submit.prevent="submitRoute">
      <div class="space-y-2">
        <input v-model="route.routeId" placeholder="Route ID" required />
        <input v-model="route.routeNo" placeholder="Route No" required />
        <input v-model="route.stBsId" @input="fetchStopName('st')" placeholder="출발 정류소 ID" required />
        <input :value="route.stNm" disabled placeholder="출발 정류소명" />
        <input v-model="route.edBsId" @input="fetchStopName('ed')" placeholder="도착 정류소 ID" required />
        <input :value="route.edNm" disabled placeholder="도착 정류소명" />
        <input v-model="route.routeNote" placeholder="노선 설명" />
        <input v-model="route.dataconnareacd" placeholder="데이터 연결 여부" />
        <input v-model="route.dirRouteNote" placeholder="정방향 설명" />
        <input v-model="route.ndirRouteNote" placeholder="역방향 설명" />
        <input v-model="route.routeTCd" placeholder="노선 타입 코드" />
      </div>

      <div class="mt-4">
        <h3>정방향 경유 정류장</h3>
        <div v-for="(stop, i) in stopsForward" :key="i" class="mb-2">
          <input v-model="stop.bsId" @input="fetchStopNameInList('forward', i)" placeholder="정류장 ID" />
          <input :value="stop.name" disabled placeholder="정류소명" />
          <button type="button" @click="removeStop('forward', i)">삭제</button>
        </div>
        <button type="button" @click="addStop('forward')">+ 정방향 추가</button>
      </div>

      <div class="mt-4">
        <h3>역방향 경유 정류장</h3>
        <div v-for="(stop, i) in stopsBackward" :key="i" class="mb-2">
          <input v-model="stop.bsId" @input="fetchStopNameInList('backward', i)" placeholder="정류장 ID" />
          <input :value="stop.name" disabled placeholder="정류소명" />
          <button type="button" @click="removeStop('backward', i)">삭제</button>
        </div>
        <button type="button" @click="addStop('backward')">+ 역방향 추가</button>
      </div>

      <button type="submit" class="mt-4 bg-green-600 text-white px-4 py-2 rounded">노선 등록</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/axiosInstance'

const searchKeyword = ref('')
const route = ref({
  routeId: '',
  routeNo: '',
  stBsId: '',
  edBsId: '',
  stNm: '',
  edNm: '',
  routeNote: '',
  dataconnareacd: 'Y',
  dirRouteNote: '',
  ndirRouteNote: '',
  routeTCd: ''
})

const stopsForward = ref([])
const stopsBackward = ref([])

const addStop = (dir) => {
  const list = dir === 'forward' ? stopsForward.value : stopsBackward.value
  list.push({ bsId: '', name: '', moveDir: dir === 'forward' ? '1' : '0' })
}

const removeStop = (dir, idx) => {
  const list = dir === 'forward' ? stopsForward.value : stopsBackward.value
  list.splice(idx, 1)
}

const fetchStopName = async (type) => {
  const bsId = type === 'st' ? route.value.stBsId : route.value.edBsId
  if (!bsId) return
  const res = await api.get(`/api/bus/stop-name?bsId=${bsId}`)
  if (type === 'st') route.value.stNm = res.data
  else route.value.edNm = res.data
}

const fetchStopNameInList = async (dir, idx) => {
  const list = dir === 'forward' ? stopsForward.value : stopsBackward.value
  const bsId = list[idx].bsId
  const res = await api.get(`/api/bus/stop-name?bsId=${bsId}`)
  list[idx].name = res.data
}

const searchBus = () => {
  if (!searchKeyword.value) return alert('검색어를 입력하세요.')
  api.get(`/api/bus/searchBSorBN?keyword=${searchKeyword.value}`)
      .then(res => console.log('검색결과:', res.data))
}

const submitRoute = async () => {
  const payload = {
    route: route.value,
    stopsForward: stopsForward.value.map(s => ({ bsId: s.bsId, moveDir: '1' })),
    stopsBackward: stopsBackward.value.map(s => ({ bsId: s.bsId, moveDir: '0' }))
  }
  try {
    await api.post('/api/bus/AddBusRoute', payload)
    alert('노선이 성공적으로 추가되었습니다!')
  } catch (e) {
    alert('오류 발생: ' + e.response?.data?.message || e.message)
  }
}
</script>
