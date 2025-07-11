<template>
  <div v-if="stops.length" class="py-2 rounded-lg">
    <h4 class="px-6 py-1 text-base font-bold mb-1.5 text-gray-700">최근 즐겨찾기한 정류장</h4>

    <BusStopList
        :stops="stops"
        :openedStopId="openedStopId"
        :arrivalDataMap="arrivalDataMap"
        :isFavorited="isFavorited"
        :toggleFavorite="toggleFavorite"
        :isLoadingArrival="isLoadingArrival"
        @selectStop="$emit('selectStop', $event)"
        @selectAsStart="$emit('selectAsStart', $event)"
        @selectAsEnd="$emit('selectAsEnd', $event)"
    />
  <hr class="border-none border-t-2 border-dashed border-gray-400 h-0 mx-6 mt-4 mb-2">
  </div>
</template>

<script setup>
import BusStopList from './BusStopList.vue'

defineProps({
  stops: {
    type: Array,
    default: () => []
  },
  openedStopId: String,
  arrivalDataMap: Object,
  isFavorited: Function,
  toggleFavorite: Function,
  isLoadingArrival: Boolean
})

defineEmits(['selectStop', 'selectAsStart', 'selectAsEnd'])
</script>

<style scoped>
.recent-favorites {
  padding: 8px 0;
  border-radius: 8px;
}

.title {
  padding: 5px 25px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #444;
}

hr {
  border: none;
  border-top: 2px dashed #808080;
  height: 0; /* 점선일 때는 height 0 */
  margin: 16px 25px 8px; /* 좌우 5px, 아래쪽 8px */
}
</style>
