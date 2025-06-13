<template>
  <div class="w-52 font-sans">
    <!-- 상단 영역: 정류장 이름 + 즐겨찾기 -->
    <div class="flex justify-between items-center mb-1.5">
      <div class="text-base font-bold whitespace-nowrap overflow-hidden overflow-ellipsis" :title="stopName">{{ stopName }}</div>
      <button class="bg-transparent border-none text-lg text-yellow-400 cursor-pointer p-0" @click="$emit('favorite')" title="즐겨찾기">★</button>
    </div>
    <!-- 도착 정보 -->
    <div class="max-h-52 overflow-y-auto mb-2 scrollbar-hide">
      <div class="flex justify-between text-sm py-0.5 border-b border-gray-100" v-for="bus in arrivals" :key="bus.routeNo">
        <div class="font-bold text-blue-500">{{ bus.routeNo }}</div>
        <div class="font-bold text-gray-700">{{ bus.arrState }}</div>
      </div>
      <div v-if="!arrivals.length" class="italic text-gray-400 text-xs text-center py-1">도착 정보 없음</div>
    </div>
    <!-- 하단 버튼 -->
    <div class="flex justify-between">
      <button class="flex-1 mx-0.5 py-1 rounded text-xs border-none cursor-pointer text-white bg-blue-500" @click="$emit('setStart')">출발지</button>
      <button class="flex-1 mx-0.5 py-1 rounded text-xs border-none cursor-pointer text-white bg-red-500" @click="$emit('setEnd')">도착지</button>
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
/* Tailwind CSS 클래스로 대체 */
.scrollbar-hide {
  scrollbar-width: none;       /* Firefox */
  -ms-overflow-style: none;    /* IE and Edge */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;               /* Chrome, Safari and Opera */
}
</style>
