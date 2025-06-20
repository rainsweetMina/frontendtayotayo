<template>
  <div class="w-50 font-sans">
    <!-- 상단 영역: 정류장 이름 + 즐겨찾기 -->
    <div class="flex justify-between items-center font-bold mb-1.5">
      <div class="text-base whitespace-nowrap overflow-hidden text-ellipsis" :title="stopName">{{ stopName }}</div>
    </div>
    <!-- 도착 정보 -->
    <div class="max-h-48 overflow-y-auto mb-2 scrollbar-hide">
      <div v-for="bus in arrivals" :key="bus.routeNo" class="flex justify-between text-sm py-0.5 border-b border-gray-100">
        <div class="font-bold text-blue-600">{{ bus.routeNo }}</div>
        <div class="font-bold text-gray-800">{{ bus.arrState }}</div>
      </div>
      <div v-if="!arrivals.length" class="italic text-gray-500 text-xs text-center py-1">도착 정보 없음</div>
    </div>
    <!-- 하단 버튼 -->
    <div class="flex justify-between">
      <button class="flex-1 mx-0.5 py-1 rounded bg-blue-600 text-white text-xs border-none cursor-pointer" @click="$emit('setStart')">출발지</button>
      <button class="flex-1 mx-0.5 py-1 rounded bg-red-600 text-white text-xs border-none cursor-pointer" @click="$emit('setEnd')">도착지</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stopName: String,
  arrivals: Array
})
defineEmits(['setStart', 'setEnd', 'favorite'])
</script>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
