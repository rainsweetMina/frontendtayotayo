<template>
  <div v-if="stops.length" class="recent-favorites">
    <h4 class="title">⭐ 최근 즐겨찾기한 정류장</h4>
    <BusStopList
        :stops="stops"
        :openedStopId="openedStopId"
        :arrivalDataMap="arrivalDataMap"
        @selectStop="$emit('selectStop', $event)"
        @selectAsStart="$emit('selectAsStart', $event)"
        @selectAsEnd="$emit('selectAsEnd', $event)"
    />
  </div>
</template>

<script setup>
import BusStopList from './BusStopList.vue'

defineProps({
  stops: Array,
  openedStopId: String,
  arrivalDataMap: Object
})

defineEmits(['selectStop', 'selectAsStart', 'selectAsEnd'])
</script>

<style scoped>
.recent-favorites {
  padding: 12px 0;
  margin-bottom: 12px;
  background: #fdf6e3;
  border-radius: 8px;
}

.title {
  padding: 5px 20px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #444;
}
</style>
