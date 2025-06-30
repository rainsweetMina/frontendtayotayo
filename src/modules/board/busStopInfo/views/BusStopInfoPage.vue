<template>
  <div class="board-main-container">
    <h2 class="page-title">정류소 정보 조회</h2>

    <!-- ✅ TabSelector + SearchBox 함께 묶기 -->
    <div class="section-box">
      <TabSelector v-model="tab" />

      <RegionSearchBox
          v-if="tab === 'region'"
          :stops="stops"
          v-model:district="district"
          v-model:neighborhood="neighborhood"
          v-model:filter="filter"
          @update-stops="stops = $event"
      />

      <RouteSearchBox
          v-if="tab === 'route'"
          :stops="stops"
          v-model:routeType="routeType"
          v-model:routeNo="routeNo"
          v-model:filter="filter"
          @update-stops="stops = $event"
      />
    </div>

    <!-- ✅ 검색 결과 -->
    <div v-if="filteredStops.length" class="section-box">
      <BusStopResultTable :stops="filteredStops" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TabSelector from '../components/TabSelector.vue'
import RegionSearchBox from '../components/RegionSearchBox.vue'
import RouteSearchBox from '../components/RouteSearchBox.vue'
import BusStopResultTable from '../components/BusStopResultTable.vue'

const tab = ref('region')
const stops = ref([])
const filter = ref('')

const district = ref('')
const neighborhood = ref('')
const routeType = ref('')
const routeNo = ref('')

const filteredStops = computed(() => {
  const keyword = filter.value.trim()
  const allStops = stops.value // ✅ 반응성 추적
  return !keyword
      ? allStops
      : allStops.filter(s =>
          (s.busStop?.bsNm || s.bsNm || '').includes(keyword)
      )
})

</script>

<style scoped>
@import "@/modules/board/assets/boardCommon.css";
@import "@/modules/board/assets/busStopInfo.css";
</style>
