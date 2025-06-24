<template>
  <div class="bus-schedule-page">
    <h2>버스 시간표</h2>

    <!-- 날짜 + 노선 + 방향/방면 선택 -->
    <ScheduleSelector
        v-model:routeNo="routeNo"
        v-model:routeNote="routeNote"
        v-model:moveDir="moveDir"
        @route-id-updated="handleRouteIdUpdated"
    />

    <hr />

    <!-- 시간표 테이블 -->
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

    <!-- 노선도 -->
    <RouteMap
        v-if="routeId && showRouteMap"
        :route-id="routeId"
        :move-dir="moveDir"
    />
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
        ...(data.moveDir !== null && { moveDir: data.moveDir })
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
@import "@/modules/board/assets/schedule.css";
</style>
