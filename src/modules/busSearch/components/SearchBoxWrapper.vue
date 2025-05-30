<template>
  <div class="search-wrapper">
    <div class="d-flex justify-content-end p-2">
      <button @click="isRouteMode = !isRouteMode" class="mode-toggle-btn" :title="isRouteMode ? '일반 검색' : '경로 검색'">
        <i :class="isRouteMode ? 'fas fa-magnifying-glass' : 'fas fa-location-dot'"></i>
      </button>
    </div>

    <BasicSearchBox v-if="!isRouteMode" />
    <RouteSearchBox v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BasicSearchBox from './SearchBox.vue'
import RouteSearchBox from './RouteSearchBox.vue'

const isRouteMode = ref(false)
</script>

<style scoped>
.mode-toggle-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.25rem;
  color: #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s, transform 0.2s;
}

.mode-toggle-btn:hover {
  background: #f8f9fa;
  transform: scale(1.05);
}

.mode-toggle-btn i {
  pointer-events: none;
}
</style>