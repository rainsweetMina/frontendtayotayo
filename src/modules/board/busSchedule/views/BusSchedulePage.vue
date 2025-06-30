<template>
  <div class="board-main-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">버스 운행 시간표</h1>
    </div>
    <ScheduleSelector
      v-model:routeNo="routeNo"
      v-model:routeNote="routeNote"
      v-model:moveDir="moveDir"
      @route-id-updated="handleRouteIdUpdated"
    />
    <hr/>
    <ScheduleTable
      v-if="shouldLoadSchedule"
      :route-id="routeId"
      :move-dir="moveDir"
      :selected-stops="selectedStops"
      :route-no="routeNo"
      :route-note="routeNote"
    />
    <div class="route-toggle" v-if="shouldLoadSchedule">
      <button class="toggle-btn" @click="showRouteMap = !showRouteMap">
        {{ showRouteMap ? '노선도 접기 ▲' : '노선도 보기 ▼' }}
      </button>
    </div>
    <div class="side-route-map" v-show="routeId && showRouteMap">
      <RouteMap :route-id="routeId" :move-dir="moveDir"/>
    </div>
  </div>
</template>

<script setup>
import api from '@/api/axiosInstance'
import {computed, ref, watch} from 'vue'
import ScheduleSelector from '@/modules/board/busSchedule/components/ScheduleSelector.vue'
import RouteMap from '@/modules/board/busSchedule/components/RouteMap.vue'
import ScheduleTable from '@/modules/board/busSchedule/components/ScheduleTable.vue'

const routeId = ref('')
const routeNo = ref('')
const routeNote = ref('')
const selectedStops = ref([])
const showRouteMap = ref(false)
const moveDir = ref(null)

const shouldLoadSchedule = computed(() => {
  return routeId.value && (
      (routeNote.value && routeNote.value.length > 0) ||
      moveDir.value !== null
  )
})

async function handleRouteIdUpdated(data) {
  routeId.value = data.routeId
  moveDir.value = data.moveDir
  routeNote.value = data.routeNote

  // ❗ 방면/방향이 아직 선택되지 않았으면 selectedStops 초기화만
  if (!data.routeNote && data.moveDir === null) {
    selectedStops.value = []
    return
  }

  // ✅ 선택된 이후에만 호출
  try {
    const res = await api.get('/api/schedule-header', {
      params: {
        routeId: data.routeId,
        ...(data.moveDir !== null && {moveDir: data.moveDir})
      }
    })
    selectedStops.value = res.data || []
  } catch (err) {
    console.error('정류장 헤더 불러오기 실패:', err)
    selectedStops.value = []
  }
}

watch([routeNo, routeNote, moveDir], () => {
  showRouteMap.value = false
  selectedStops.value = []
})
</script>

<style scoped>
@import "@/modules/board/assets/boardCommon.css";
@import "@/modules/board/assets/schedule.css";

.bus-schedule-layout {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 0 auto;
  padding: 0 20px;
  max-width: 1400px;
}

/* ✅ 디자인은 유지하되 너비만 고정 */
.bus-schedule-page {
  max-width: 1000px;
  width: 100%;
  transition: all 0.3s;
}

/* 노선도는 오른쪽에 자연스럽게 */
.side-route-map {
  width: 300px;
  align-self: stretch; /* 왼쪽 본문 높이만큼 자동 확장 */
  background: none;
  border: none;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  overflow: hidden; /* 스크롤 제거 */
  transition: all 0.3s;
}

/* 반응형 처리 */
@media (max-width: 1024px) {
  .bus-schedule-layout {
    flex-direction: column;
    align-items: center;
  }

  .side-route-map {
    width: 100%;
    max-height: none;
    margin-top: 16px;
  }
}

.title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-left: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
  border-left: 6px solid #4d9eff;
}
</style>
