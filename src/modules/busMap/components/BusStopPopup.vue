<template>
  <div class="w-52 font-sans">
    <!-- 상단 영역: 정류장 이름 + 즐겨찾기 -->
    <div class="flex justify-between items-center mb-2">
      <div
          class="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis"
          :title="stopName"
      >
        {{ stopName }}
      </div>
      <button
          class="text-yellow-400 hover:text-yellow-500 transition-colors text-lg"
          @click="$emit('favorite')"
          :aria-pressed="isFavorite.toString()"
          title="즐겨찾기"
      >
        <span :class="['transition', isFavorite ? 'text-yellow-400' : 'text-gray-300']">
          ★
        </span>
      </button>
    </div>

    <!-- 도착 정보 -->
    <div class="max-h-52 overflow-y-auto mb-2 custom-scroll">
      <div
          v-for="bus in arrivals"
          :key="bus.routeNo"
          class="flex justify-between items-center text-sm py-1 border-b border-gray-100"
      >
        <span class="font-semibold text-blue-500">{{ bus.routeNo }}</span>
        <span class="font-semibold text-gray-700">{{ bus.arrState }}</span>
      </div>
      <div v-if="!arrivals.length" class="italic text-gray-400 text-xs text-center py-2">
        도착 정보 없음
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="flex gap-1">
      <button
          class="flex-1 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          @click="$emit('setStart')"
      >
        출발지
      </button>
      <button
          class="flex-1 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition"
          @click="$emit('setEnd')"
      >
        도착지
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stopName: String,
  arrivals: Array,
  isFavorite: Boolean // 부모로부터 즐겨찾기 상태 전달
})

defineEmits(['setStart', 'setEnd', 'favorite'])
</script>

<style scoped>
.custom-scroll {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.custom-scroll::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
</style>
