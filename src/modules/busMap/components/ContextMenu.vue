<template>
  <div
      class="absolute z-[9999] bg-white rounded-lg shadow-xl p-1 border border-gray-300 w-40"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
  >
    <button class="flex items-center w-full bg-transparent hover:bg-blue-100 px-3 py-2 text-sm text-gray-700 hover:text-blue-700 transition-colors" @click="$emit('selectAsStart', coords)">
      <img :src="startMarkerIcon" alt="출발지" class="w-7 h-7 mr-2"/>
      <span class="text-gray-800 font-medium">출발지 지정</span>
    </button>
    <button class="flex items-center w-full bg-transparent hover:bg-blue-100 px-3 py-2 text-sm text-gray-700 hover:text-blue-700 transition-colors" @click="$emit('selectAsEnd', coords)">
      <img :src="arrivalMarkerIcon" alt="도착지" class="w-7 h-7 mr-2"/>
      <span class="text-gray-800 font-medium">도착지 지정</span>
    </button>
  </div>
</template>

<script setup>
import startMarkerIcon from '@/assets/icons/start_marker_icon.png'
import arrivalMarkerIcon from '@/assets/icons/arrival_marker_icon.png'

defineProps({
  position: Object,
  coords: Object
})
defineEmits(['selectAsStart', 'selectAsEnd'])
</script>
