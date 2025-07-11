<template>
  <div v-if="schedules.length && orderedStops.length" class="schedule-view">
    <table class="schedule-table">
      <thead>
      <tr>
        <th>순서</th>
        <th v-for="seq in orderedStops" :key="seq">{{ getStopName(seq) }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in schedules" :key="index">
        <td>{{ row.scheduleNo }}</td>
        <td v-for="(seq, idx) in orderedStops" :key="idx">
          {{ row[`schedule_${String.fromCharCode(65 + idx)}`] }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import { ref, watch, computed } from 'vue'
import api from '@/api/axiosInstance'

const props = defineProps({
  routeId: String,
  moveDir: [String, Number, null],
  selectedStops: Array,
  routeNo: String,
  routeNote: String,
})

const schedules = ref([])
const stopMap = ref({})

// 정렬된 정류장 순서
const orderedStops = computed(() => {
  return [...props.selectedStops].sort((a, b) => a - b)
})

// routeId 또는 moveDir 변경 시 시간표 조회
watch(
    () => [props.routeId, props.moveDir, props.routeNote],
    async ([routeId, moveDir, routeNote]) => {
      if (!routeId || (moveDir == null && !routeNote)) return

      try {
        const res = await api.get('/api/route-map', {
          params: {
            routeId,
            ...(moveDir != null && { moveDir })
          }
        })
        stopMap.value = Object.fromEntries(res.data.map(s => [s.seq, s.bsNm]))
      } catch (err) {
        console.error('🛑 정류장 이름 로딩 실패:', err)
      }
    }
)

watch(
    () => [props.routeNo, props.routeNote, props.moveDir],
    async ([routeNo, routeNote, moveDir]) => {
      if (!routeNo || (!routeNote && moveDir == null)) return

      try {
        const params = {
          routeNo,
          ...(routeNote ? { routeNote } : {}),
          ...(moveDir != null ? { moveDir } : {})
        }

        const res = await api.get('/api/schedules', { params })
        schedules.value = res.data || []
      } catch (err) {
        console.error('🛑 시간표 로딩 실패:', err)
        schedules.value = []
      }
    }
)

function getStopName(seq) {
  return stopMap.value[seq] || `정류장(${seq})`
}
</script>

<style scoped>
@import "@/modules/board/assets/schedule.css";

</style>
