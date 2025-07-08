<template>
  <div :class="['bus-schedule-layout', { 'with-map': showRouteMap && routeId }]">
    <!-- 메인 콘텐츠 박스 -->
    <div
        :class="['board-main-container', { 'narrow': showRouteMap && routeId }]"
    >
      <div class="flex justify-between items-center">
        <h1 class="title mb-0">버스 운행 시간표</h1>
      </div>

      <ScheduleSelector
          v-model:routeNo="routeNo"
          v-model:routeNote="routeNote"
          v-model:moveDir="moveDir"
          @route-id-updated="handleRouteIdUpdated"
      />

      <hr />

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
    </div>

    <!-- 노선도 (오른쪽) -->
    <div class="outside-route-map" v-if="showRouteMap && routeId">
      <RouteMap :route-id="routeId" :move-dir="moveDir" />
    </div>
  </div>
</template>


<script setup>
import { publicApi } from '@/api/axiosInstance'
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
    const res = await publicApi.get('/api/schedule-header', {
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
/*@import "@/modules/board/assets/boardCommon.css";*/
@import "@/modules/board/assets/schedule.css";

/* 기본 상태: 가운데 정렬 */
.bus-schedule-layout {
  display: block;
  max-width: 1240px;
  margin: 0px auto;
}

.selector-container {
  padding: 20px;
  margin: 16px 0;
}


/* 노선도 열렸을 때만 flex로 전환 */
.bus-schedule-layout.with-map {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

/* 메인 콘텐츠 기본 */
.board-main-container {
  background: #fff;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(25, 118, 210, 0.3);
  width: 100%;
  max-width: 1240px;
  transition: all 0.3s ease;
}

/* 노선도 있을 때 좁아지도록 */
.board-main-container.narrow {
  max-width: calc(100% - 320px); /* RouteMap 공간 확보 */
}

/* 오른쪽 노선도 */
.outside-route-map {
  width: 300px;
  flex-shrink: 0;
  align-self: stretch;
}

/* 모바일에서는 항상 세로 배치 */
@media (max-width: 1024px) {
  .bus-schedule-layout.with-map {
    flex-direction: column;
    align-items: center;
  }

  .board-main-container,
  .board-main-container.narrow,
  .outside-route-map {
    max-width: 100%;
    width: 100%;
  }

  .outside-route-map {
    margin-top: 16px;
  }
}

</style>
