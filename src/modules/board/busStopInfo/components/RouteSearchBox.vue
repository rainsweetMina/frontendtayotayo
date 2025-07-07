<template>
  <div class="search-box">
    <label>
      노선 유형:
      <select :value="routeType" @change="onTypeChange($event.target.value)">
        <option value="">-- 노선 유형 선택 --</option>
        <option value="순환">순환</option>
        <option value="급행">급행</option>
        <option value="간선">간선</option>
        <option value="지선">지선</option>
      </select>
    </label>

    <label>
      노선 선택:
      <select :value="routeNo" @change="onRouteChange($event.target.value)">
        <option value="">-- 노선 선택 --</option>
        <option v-for="no in routeNos" :key="no" :value="no">{{ no }}</option>
      </select>
    </label>

    <label>
      정류소명 검색:
      <input
          :value="filter"
          @input="e => emit('update:filter', e.target.value)"
          placeholder="정류소명 입력"
      />
    </label>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from '@/api/axiosInstance'

const props = defineProps({
  routeType: String,
  routeNo: String,
  filter: String,
  stops: Array
})

const emit = defineEmits(['update:routeType', 'update:routeNo', 'update:filter', 'update-stops'])

const routeNos = ref([])

// ✅ 노선 유형 변경
function onTypeChange(type) {
  emit('update:routeType', type)
  emit('update:routeNo', '')  // 노선 초기화
  emit('update-stops', [])
  routeNos.value = []

  if (!type) return
  api.get('/api/bus-info/route-nos', { params: { type } }).then(res => {
    routeNos.value = res.data
  })
}

// ✅ 노선 선택 시 정류소 조회
function onRouteChange(routeNo) {
  emit('update:routeNo', routeNo)
  if (!routeNo) return

  api.get('/api/bus-info/search-by-route', {
    params: { routeNo }
  }).then(res => {
    emit('update-stops', res.data)
  })
}
</script>

<style scoped>
@import "@/modules/board/assets/busStopInfo.css";
</style>
