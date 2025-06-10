<template>
  <div
      class="context-menu"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
  >
    <button class="menu-btn" @click="$emit('selectAsStart', coords)">
      <i class="fas fa-map-marker-alt"></i> 출발지 지정
    </button>
    <button class="menu-btn" @click="$emit('selectAsEnd', coords)">
      <i class="fas fa-flag-checkered"></i> 도착지 지정
    </button>
  </div>
</template>

<script setup>
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
  padding: 8px 0;
  min-width: 160px;
  border: 1px solid #e0e0e0;
  font-family: 'Noto Sans KR', sans-serif;
}

.menu-btn {
  display: flex;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s ease;
}

.menu-btn i {
  margin-right: 8px;
  color: #007bff;
}

.menu-btn:hover {
  background: #f0f4ff;
  color: #007bff;
}
</style>
