<template>
  <div>
    <h3 class="section-title">요금 (2025.02.24부터 적용)</h3>
    <table class="fare-table">
      <thead>
      <tr>
        <th colspan="2">구분</th>
        <th>일반<br />(19세이상)</th>
        <th>청소년<br />(13~18세)</th>
        <th>어린이<br />(6~12세)</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="(group, idx) in groupedFares" :key="idx">
        <tr v-for="(f, i) in group" :key="i">
          <td v-if="i === 0" :rowspan="group.length">{{ f.busTypeName }}</td>
          <td>{{ f.payTypeName }}</td>
          <td>{{ f.fareAdult.toLocaleString() }}</td>
          <td>{{ f.fareTeen.toLocaleString() }}</td>
          <td>{{ f.fareChild.toLocaleString() }}</td>
        </tr>
      </template>
      </tbody>
    </table>
    <p class="fare-note">※ 보호자(성인)가 동반하는 6세 미만의 소아 3인은 무임 운송. 3인을 초과하면 어린이 요금 적용.</p>
  </div>
</template>

<script setup>
const props = defineProps({ fares: Array })
import { computed } from 'vue'

const groupedFares = computed(() => {
  const map = new Map()
  props.fares.forEach(f => {
    if (!map.has(f.busType)) map.set(f.busType, [])
    map.get(f.busType).push(f)
  })
  return Array.from(map.values())
})
</script>

<style scoped>
@import "@/modules/board/assets/routeMap.css";
</style>