<template>
  <table v-if="stops?.length" class="bus-stop-result-table">
    <thead>
    <tr>
      <th>주소</th>
      <th>정류소명</th>
      <th>지도</th>
      <th>주소</th>
      <th>정류소명</th>
      <th>지도</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(left, index) in leftStops" :key="index">
      <!-- 왼쪽 -->
      <td>{{ left.district }} {{ left.neighborhood || '' }}</td>
      <td>{{ left.busStop?.bsNm || left.bsNm }}</td>
      <td>
        <a :href="`/bus/map?bsId=${left.busStop?.bsId || left.bsId}`" target="_blank">
          <i class="fa fa-map-marker-alt"></i>️
        </a>
      </td>

      <!-- 오른쪽 -->
      <template v-if="rightStops[index]">
        <td>{{ rightStops[index].district }} {{ rightStops[index].neighborhood || '' }}</td>
        <td>{{ rightStops[index].busStop?.bsNm || rightStops[index].bsNm }}</td>
        <td>
          <a :href="`/bus/map?bsId=${rightStops[index].busStop?.bsId || rightStops[index].bsId}`" target="_blank">
            <i class="fa fa-map-marker-alt"></i>
          </a>
        </td>
      </template>
      <template v-else>
        <td></td><td></td><td></td>
      </template>
    </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stops: {
    type: Array,
    required: true
  }
})

const leftStops = computed(() => {
  const half = Math.ceil(props.stops.length / 2)
  return props.stops.slice(0, half)
})

const rightStops = computed(() => {
  const half = Math.ceil(props.stops.length / 2)
  return props.stops.slice(half)
})
</script>

<style scoped>
@import "@/modules/board/assets/busStopInfo.css";

.bus-stop-result-table a:hover {
  color: #0a3f94;
}
</style>
