<template>
  <div
      class="context-menu"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
  >
    <button @click="$emit('selectAsStart', coords)">출발지 지정</button>
    <button @click="$emit('selectAsEnd', coords)">도착지 지정</button>
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
  background: white;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
