<template>
  <div
      class="context-menu"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
  >
    <button class="menu-btn" @click="$emit('selectAsStart', coords)">
      <img :src="startMarkerIcon" alt="출발지" style="width: 30px; height: 30px;"/>
      <span>출발지 지정</span>
    </button>
    <button class="menu-btn" @click="$emit('selectAsEnd', coords)">
      <img :src="arrivalMarkerIcon" alt="도착지" style="width: 30px; height: 30px;"/>
      <span>도착지 지정</span>
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

<style scoped>
.context-menu {
  position: absolute;
  z-index: 9999;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  padding: 4px 0;
  border: 1px solid #e0e0e0;
  font-family: 'Noto Sans KR', sans-serif;
  width: 140px;
}

.menu-btn {
  display: flex;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  padding: 5px 10px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s ease;
  /*justify-content: center;*/
}

.menu-btn i {
  margin-right: 8px;
  color: #007bff;
}

.menu-btn:hover {
  background: #f0f4ff;
  color: #007bff;
}

img, span {
  margin: 2px;
}

span {
  color: #444;
}
</style>
