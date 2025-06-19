<template>
  <div class="popup-wrapper">
    <!-- 상단 영역: 정류장 이름 + 즐겨찾기 -->
    <div class="popup-header">
      <div class="stop-name" :title="stopName">{{ stopName }}</div>
    </div>
    <!-- 도착 정보 -->
    <div class="popup-scroll-area">
      <div class="bus-info" v-for="bus in arrivals" :key="bus.routeNo">
        <div class="route-no">{{ bus.routeNo }}</div>
        <div class="arr-time">{{ bus.arrState }}</div>
      </div>
      <div v-if="!arrivals.length" class="no-info">도착 정보 없음</div>
    </div>
    <!-- 하단 버튼 -->
    <div class="footer-buttons">
      <button class="start-btn" @click="$emit('setStart')">출발지</button>
      <button class="end-btn" @click="$emit('setEnd')">도착지</button>
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
.popup-wrapper {
  width: 200px;
  font-family: 'Segoe UI', sans-serif;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 6px;
}

.stop-name {
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favorite-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-icon {
  font-size: 20px;
  color: #ccc;
  transition: color 0.3s;
}

.favorite-icon:hover {
  color: #999;
}

.favorite-icon.active {
  color: gold;
}

.popup-scroll-area {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 8px;

  scrollbar-width: none;
  -ms-overflow-style: none;
}

.bus-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 3px 0;
  border-bottom: 1px solid #eee;
}

.route-no {
  font-weight: bold;
  color: #0d82ff;
}

.arr-time {
  font-weight: bold;
  color: #2c3e50;
}

.no-info {
  font-style: italic;
  color: #999;
  font-size: 13px;
  text-align: center;
  padding: 4px 0;
}

.footer-buttons {
  display: flex;
  justify-content: space-between;
}

.footer-buttons button {
  flex: 1;
  margin: 0 2px;
  padding: 5px;
  border-radius: 4px;
  font-size: 13px;
  border: none;
  cursor: pointer;
  color: white;
}

.start-btn {
  background-color: #007bff;
}
.end-btn {
  background-color: #fa4141;
}

hr {
  border: none;
  border-top: 1px solid #5e5d5d;
  margin: 6px 0;
}
</style>
